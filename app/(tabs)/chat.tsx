import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { commonStyles } from "../../components/ui/theme";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const SIDEBAR_WIDTH = 200;

const Chat = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const sidebarAnim = useRef(new Animated.Value(0)).current; // 0 = visible, -SIDEBAR_WIDTH = hidden

  // Animate sidebar toggle
  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarVisible ? -SIDEBAR_WIDTH : 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(!sidebarVisible));
  };

  // 🔹 Load conversations
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
        (payload) => setMessages((prev) => [...prev, payload.new as any])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // 🔹 Send a message
  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;
    const newMessage = { conversation_id: conversationId, sender: "user", text: input };
    const { data, error } = await supabase
      .from("messages")
      .insert(newMessage)
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
    } else if (data) {
      setMessages((prev) => [...prev, data]); // use real DB row
    }
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

  // 🔹 Delete a conversation
  const handleDeleteConversation = async (id: string) => {
    try {
      await supabase.from("messages").delete().eq("conversation_id", id);
      await supabase.from("conversations").delete().eq("id", id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        const next = conversations.find((c) => c.id !== id);
        setConversationId(next ? next.id : null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={commonStyles.screenHeader}>
        <Text style={commonStyles.screenTitle}>Health Chat</Text>
      </View>

      {/* Sidebar (animated) */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarAnim }] },
        ]}
      >
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={styles.sidebarTitle}>Conversations</Text>
          <TouchableOpacity style={styles.hideSidebarButton} onPress={toggleSidebar}>
            <Text style={styles.hideSidebarButtonText}>←</Text>
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
                onPress={() => handleDeleteConversation(item.id)}
                style={styles.trashButton}
              >
                <Text style={styles.trashButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </Animated.View>

      {/* Sidebar toggle button (when hidden) */}
      {!sidebarVisible && (
        <TouchableOpacity style={styles.showSidebarButton} onPress={toggleSidebar}>
          <Text style={styles.showSidebarButtonText}>→</Text>
        </TouchableOpacity>
      )}

      {/* Main chat area */}
      <View style={[styles.chatArea]}>
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
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor={COLORS.secondary}
          />
          <Button title="Send" onPress={handleSend} variant="primary" size="small" style={{ marginLeft: 8 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary3 },
  sidebar: {
    position: "absolute",
    top: 60,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    ...commonStyles.card,
    zIndex: 10,
  },
  sidebarTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8, color: COLORS.text },
  sidebarItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sidebarItem: { padding: 10, borderRadius: 6, flex: 1, backgroundColor: COLORS.primary2 },
  chatArea: { flex: 1, marginTop: 16, ...commonStyles.card },
  messageBubble: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: "80%" },
  userBubble: { backgroundColor: COLORS.primary, alignSelf: "flex-end" },
  botBubble: { backgroundColor: COLORS.secondary, alignSelf: "flex-start" },
  messageText: { fontSize: 15, color: COLORS.primary2 },
  inputContainer: { flexDirection: "row", alignItems: "center", margin: 8 },
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
    padding: 4,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  hideSidebarButtonText: { color: COLORS.primary2, fontSize: 16 },
  showSidebarButton: {
    position: "absolute",
    top: 70,
    left: 8,
    padding: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    zIndex: 11,
  },
  showSidebarButtonText: { color: COLORS.primary2, fontSize: 16 },
  trashButton: {
    marginLeft: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  trashButtonText: { fontSize: 14, color: COLORS.primary2 },
});

export default Chat;
