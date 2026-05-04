import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Message = {
  id: number;
  role: "user" | "counselor";
  text: string;
};

const starterPrompts = [
  "I need to talk.",
  "I’m overthinking.",
  "Call me out.",
  "Help me think clearly.",
];

const fakeReplies = [
  "Alright, back up. Give me the backstory before we start pretending this is a clean decision.",
  "Slow down. What actually happened here? Not the dramatic trailer version, the real version.",
  "Before I call bullshit or back you up, I need context. Who did what, and what are you hoping happens next?",
  "Okay. Tell me the ugly version first. What happened, what did you do, and what are you avoiding admitting?",
  "Hold on. Are you trying to solve the problem, or are you trying to get a quick emotional hit? Give me the backstory.",
  "Fine, but start from the beginning. I am not handing you advice based on half a sentence and panic.",
  "Good. Say it properly. What happened, why does it still have a grip on you, and what do you want from this?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = (customMessage?: string) => {
    const trimmedMessage = (customMessage ?? inputValue).trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmedMessage,
    };

    const counselorMessage: Message = {
      id: Date.now() + 1,
      role: "counselor",
      text: fakeReplies[Math.floor(Math.random() * fakeReplies.length)],
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      counselorMessage,
    ]);

    setInputValue("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appLabel}>COUNSELOR</Text>
            <Text style={styles.headerTitle}>Private conversation</Text>
          </View>

          <Pressable style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={[
            styles.chatContent,
            messages.length === 0 && styles.emptyChatContent,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.defaultVoiceBadge}>
                <Text style={styles.defaultVoiceBadgeText}>DEFAULT VOICE</Text>
              </View>

              <Text style={styles.emptyTitle}>
                What’s actually on your mind?
              </Text>

              <Text style={styles.emptyText}>
                Say it messy. Counselor will pull the truth out of it.
              </Text>

              <View style={styles.promptGrid}>
                {starterPrompts.map((prompt) => (
                  <Pressable
                    key={prompt}
                    style={styles.promptChip}
                    onPress={() => sendMessage(prompt)}
                  >
                    <Text style={styles.promptChipText}>{prompt}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.messageList}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.role === "user"
                      ? styles.userBubble
                      : styles.counselorBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === "user"
                        ? styles.userMessageText
                        : styles.counselorMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Say what is actually on your mind..."
            placeholderTextColor={colors.dim}
            multiline
          />

          <Pressable style={styles.sendButton} onPress={() => sendMessage()}>
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const colors = {
  background: "#050507",
  panel: "#0d0d12",
  panelSoft: "#13131b",
  panelRed: "#1a080d",
  panelBlue: "#07151d",
  panelYellow: "#1d1706",
  border: "#24202b",
  borderRed: "#ff304f",
  borderBlue: "#18d7ff",
  borderYellow: "#ffd166",
  red: "#ff304f",
  redSoft: "#ff6b7f",
  blueSoft: "#8eeaff",
  yellow: "#ffd166",
  yellowSoft: "#ffe29a",
  text: "#f5f2f4",
  muted: "#aaa3ad",
  dim: "#77717f",
  black: "#09070a",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingTop: 62,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 14,
  },
  appLabel: {
    color: colors.red,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.4,
    marginBottom: 4,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  upgradeButton: {
    backgroundColor: colors.panelYellow,
    borderColor: colors.borderYellow,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  upgradeButtonText: {
    color: colors.yellowSoft,
    fontSize: 13,
    fontWeight: "900",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 12,
  },
  emptyChatContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 6,
  },
  defaultVoiceBadge: {
    backgroundColor: colors.panelBlue,
    borderColor: colors.borderBlue,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 18,
  },
  defaultVoiceBadgeText: {
    color: colors.blueSoft,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 24,
  },
  promptGrid: {
    width: "100%",
    gap: 10,
  },
  promptChip: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  promptChipText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  messageList: {
    gap: 12,
    paddingBottom: 12,
  },
  messageBubble: {
    maxWidth: "88%",
    borderRadius: 20,
    padding: 14,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.red,
    borderBottomRightRadius: 6,
  },
  counselorBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.panelSoft,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: colors.black,
    fontWeight: "800",
  },
  counselorMessageText: {
    color: colors.text,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 10,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: colors.red,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendButtonText: {
    color: colors.black,
    fontWeight: "900",
  },
});
