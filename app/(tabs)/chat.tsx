import Constants from 'expo-constants';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';

const Chat = () => {
  const statusBarHeight = Constants.statusBarHeight;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hello! How can I help you today?' },
    { id: '2', sender: 'user', text: 'Hi, I have a question.' },
  ]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([
      ...messages,
      { id: Date.now().toString(), sender: 'user', text: input }
    ]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: Platform.OS === 'android' ? 16 : statusBarHeight + 8,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <Text style={styles.header}>Health Chat</Text>
      </View>
      <View style={styles.contentArea}>
        {sidebarVisible && (
          <View style={styles.sidebar}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sidebarTitle}>Conversation History</Text>
              <TouchableOpacity
                style={styles.hideSidebarButton}
                onPress={() => setSidebarVisible(false)}
                accessibilityLabel="Hide conversation history"
              >
                <Text style={styles.hideSidebarButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Text style={styles.sidebarItem}>
                  {item.sender === 'user' ? 'You: ' : 'Bot: '}
                  {item.text}
                </Text>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        {/* Main chat area */}
        <View style={[styles.chatArea, !sidebarVisible && { flex: 1.2 }]}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble
              ]}>
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
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            {!sidebarVisible && (
              <TouchableOpacity style={styles.showSidebarButton} onPress={() => setSidebarVisible(true)}>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }}>Show History</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  sidebar: {
    width: 160,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 12,
    marginTop: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sidebarTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  sidebarItem: {
    fontSize: 13,
    marginBottom: 6,
    color: COLORS.secondary,
  },
  chatArea: {
    flex: 1.3,
    padding: 10,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    color: '#fff', // Make chat text white
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  showSidebarButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  hideSidebarButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  hideSidebarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Chat;