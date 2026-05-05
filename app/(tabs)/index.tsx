import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

function AnimatedMessageBubble({ message }: { message: Message }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY]);

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        message.role === "user" ? styles.userBubble : styles.counselorBubble,
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
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
    </Animated.View>
  );
}

function TypingBubble() {
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleTranslateY = useRef(new Animated.Value(10)).current;

  const dotOne = useRef(new Animated.Value(0.25)).current;
  const dotTwo = useRef(new Animated.Value(0.25)).current;
  const dotThree = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bubbleTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.25,
            duration: 280,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.delay(260),
        ]),
      );

    const animations = [
      animateDot(dotOne, 0),
      animateDot(dotTwo, 150),
      animateDot(dotThree, 300),
    ];

    animations.forEach((animation) => animation.start());

    return () => {
      animations.forEach((animation) => animation.stop());
    };
  }, [bubbleOpacity, bubbleTranslateY, dotOne, dotThree, dotTwo]);

  const getDotStyle = (dot: Animated.Value) => ({
    opacity: dot,
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0.25, 1],
          outputRange: [2, -3],
        }),
      },
    ],
  });

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        styles.counselorBubble,
        styles.typingBubble,
        {
          opacity: bubbleOpacity,
          transform: [{ translateY: bubbleTranslateY }],
        },
      ]}
    >
      <View style={styles.typingDotsRow}>
        <Animated.View style={[styles.typingDot, getDotStyle(dotOne)]} />
        <Animated.View style={[styles.typingDot, getDotStyle(dotTwo)]} />
        <Animated.View style={[styles.typingDot, getDotStyle(dotThree)]} />
      </View>
    </Animated.View>
  );
}

function EmptyState({
  onPromptPress,
}: {
  onPromptPress: (prompt: string) => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.defaultVoiceBadge}>
        <Text style={styles.defaultVoiceBadgeText}>DEFAULT VOICE</Text>
      </View>

      <Text style={styles.emptyTitle}>What’s actually on your mind?</Text>

      <Text style={styles.emptyText}>
        Say it messy. Counselor will pull the truth out of it.
      </Text>

      <View style={styles.promptGrid}>
        {starterPrompts.map((prompt) => (
          <Pressable
            key={prompt}
            style={({ pressed }) => [
              styles.promptChip,
              pressed && styles.promptChipPressed,
            ]}
            onPress={() => onPromptPress(prompt)}
          >
            <Text style={styles.promptChipText}>{prompt}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isCounselorTyping, setIsCounselorTyping] = useState(false);
  const [typingVisible, setTypingVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isCounselorTyping, typingVisible]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
  };

  const sendMessage = (customMessage?: string) => {
    const trimmedMessage = (customMessage ?? inputValue).trim();

    if (!trimmedMessage || isCounselorTyping) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmedMessage,
    };

    const finalReply: Message = {
      id: Date.now() + 1,
      role: "counselor",
      text: fakeReplies[Math.floor(Math.random() * fakeReplies.length)],
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsCounselorTyping(true);
    setTypingVisible(true);

    const shouldRethink = Math.random() > 0.82;

    if (shouldRethink) {
      addTimeout(() => {
        setTypingVisible(false);
      }, 950);

      addTimeout(() => {
        setTypingVisible(true);
      }, 1500);

      addTimeout(() => {
        setMessages((currentMessages) => [...currentMessages, finalReply]);
        setIsCounselorTyping(false);
        setTypingVisible(false);
      }, 2850);

      return;
    }

    addTimeout(() => {
      setMessages((currentMessages) => [...currentMessages, finalReply]);
      setIsCounselorTyping(false);
      setTypingVisible(false);
    }, 850);
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

          <Pressable
            style={({ pressed }) => [
              styles.upgradeButton,
              pressed && styles.upgradeButtonPressed,
            ]}
          >
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={[
            styles.chatContent,
            messages.length === 0 && styles.emptyChatContent,
          ]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <EmptyState onPromptPress={sendMessage} />
          ) : (
            <View style={styles.messageList}>
              {messages.map((message) => (
                <AnimatedMessageBubble key={message.id} message={message} />
              ))}

              {isCounselorTyping && typingVisible && <TypingBubble />}
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

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
              isCounselorTyping && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const colors = {
  background: "#070812",
  panel: "#11131c",
  panelSoft: "#171a26",
  panelPrimary: "#24141b",
  panelIndigo: "#13162a",
  panelAmber: "#241d10",
  border: "#272b3a",
  borderStrong: "#383d52",
  primary: "#e85d75",
  primarySoft: "#ff8fa3",
  indigo: "#7c8cff",
  indigoSoft: "#aeb7ff",
  amber: "#f2b84b",
  amberSoft: "#ffd98a",
  teal: "#2dd4bf",
  tealSoft: "#8ff3e6",
  text: "#f4f1f4",
  muted: "#b2adbb",
  dim: "#7f7a8d",
  black: "#090a10",
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
    color: colors.primarySoft,
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
    backgroundColor: colors.panelAmber,
    borderColor: colors.amber,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  upgradeButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  upgradeButtonText: {
    color: colors.amberSoft,
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
    backgroundColor: colors.panelIndigo,
    borderColor: colors.indigo,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 18,
  },
  defaultVoiceBadgeText: {
    color: colors.indigoSoft,
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
  promptChipPressed: {
    backgroundColor: colors.panelSoft,
    borderColor: colors.primary,
    transform: [{ scale: 0.99 }],
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
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  counselorBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.panelSoft,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingBubble: {
    minWidth: 64,
    paddingVertical: 13,
  },
  typingDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.muted,
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
    borderColor: colors.borderStrong,
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
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendButtonText: {
    color: colors.black,
    fontWeight: "900",
  },
});
