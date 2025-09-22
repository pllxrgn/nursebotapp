import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { commonStyles } from "../../components/ui/theme";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const Chat = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // 🔹 Load user’s conversations
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading conversations:", error);
      else setConversations(data || []);

      // If none selected, pick the most recent
      if (data?.length && !conversationId) {
        setConversationId(data[0].id);
      }
    };

    loadConversations();
  }, [user]);

  // 🔹 Load messages for active conversation
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("timestamp", { ascending: true });

      if (error) console.error("Error loading messages:", error);
      else setMessages(data || []);
    };

    loadMessages();
  }, [conversationId]);

  // 🔹 Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as any]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // 🔹 Send a message
  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const newMessage = {
      conversation_id: conversationId,
      sender: "user",
      text: input,
    };

    const { error } = await supabase.from("messages").insert(newMessage);
    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessages((prev) => [
        ...prev,
        { ...newMessage, id: Date.now().toString(), timestamp: new Date().toISOString() },
      ]);
    }

    setInput("");
  };

  // 🔹 Create a new conversation
  const handleNewConversation = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: `Chat ${conversations.length + 1}` })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return;
    }

    setConversations((prev) => [data, ...prev]);
    setConversationId(data.id);
    setMessages([]);
  };

  return (
    <View style={styles.container}>
      <View style={commonStyles.screenHeader}>
        <Text style={commonStyles.screenTitle}>Health Chat</Text>
      </View>
      <View style={styles.contentArea}>
        {sidebarVisible && (
          <View style={styles.sidebar}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
            >
              <Text style={styles.sidebarTitle}>Conversations</Text>
              <TouchableOpacity
                style={styles.hideSidebarButton}
                onPress={() => setSidebarVisible(false)}
              >
                <Text style={styles.hideSidebarButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="+ New Chat"
              variant="outline"
              onPress={handleNewConversation}
              style={{ marginVertical: 8 }}
            />

            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.sidebarItemRow}>
                  {/* Conversation title button */}
                  <TouchableOpacity
                    style={[
                      styles.sidebarItem,
                      item.id === conversationId && { backgroundColor: COLORS.chatbot },
                    ]}
                    onPress={() => setConversationId(item.id)}
                  >
                    <Text style={{ color: COLORS.text }}>
                      {item.title || "Untitled Chat"}
                    </Text>
                  </TouchableOpacity>

                  {/* Trash button */}
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        // Delete all messages in this conversation
                        const { error: msgError } = await supabase
                          .from("messages")
                          .delete()
                          .eq("conversation_id", item.id);

                        if (msgError) throw msgError;

                        // Delete the conversation itself
                        const { error: convError } = await supabase
                          .from("conversations")
                          .delete()
                          .eq("id", item.id);

                        if (convError) throw convError;

                        // Update state
                        setConversations((prev) => prev.filter((c) => c.id !== item.id));

                        if (conversationId === item.id) {
                          // If current convo deleted, switch to next one (or none)
                          const next = conversations.find((c) => c.id !== item.id);
                          setConversationId(next ? next.id : null);
                          setMessages([]);
                        }
                      } catch (err) {
                        console.error("Error deleting conversation:", err);
                      }
                    }}
                    style={styles.trashButton}
                  >
                    <Text style={styles.trashButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Main chat area */}
        <View style={[styles.chatArea, !sidebarVisible && { flex: 1.2 }]}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.secondary}
            />
            <Button
              title="Send"
              onPress={handleSend}
              variant="primary"
              size="small"
              style={{ marginLeft: 8 }}
            />
            {!sidebarVisible && (
              <Button
                title="Show Conversations"
                onPress={() => setSidebarVisible(true)}
                variant="outline"
                size="small"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary3 },
  contentArea: { flex: 1, flexDirection: "row", paddingHorizontal: 16, backgroundColor: COLORS.primary3 },
  sidebar: { width: 180, marginTop: 16, marginRight: 16, ...commonStyles.card },
  sidebarTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8, color: COLORS.text },
  sidebarItem: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: COLORS.primary2,
  },
  chatArea: { flex: 1.3, justifyContent: "flex-end", marginTop: 16, ...commonStyles.card },
  messageBubble: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: "80%" },
  userBubble: { backgroundColor: COLORS.primary, alignSelf: "flex-end" },
  botBubble: { backgroundColor: COLORS.secondary, alignSelf: "flex-start" },
  messageText: { fontSize: 15, color: COLORS.primary2 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 4 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: COLORS.primary2,
    color: COLORS.text,
  },
  hideSidebarButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  sidebarItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  trashButton: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  trashButtonText: {
    fontSize: 14,
    color: COLORS.primary2,
  },
  hideSidebarButtonText: { color: COLORS.primary2, fontWeight: "bold", fontSize: 18, textAlign: "center" },
});

export default Chat;
