import cors from "cors";
import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = 4000;

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  : null;

app.use(cors());
app.use(express.json());

const fallbackReplies = [
  "OpenAI is not connected yet, so I am still running on fallback replies. But fine, give me the backstory.",
  "No API key found yet. The brain is not plugged in. Say the messy version anyway.",
  "Still in local fallback mode. Not glamorous, but it works. What actually happened?",
];

const greetingReplies = [
  "Hey.",
  "Yo. What’s up?",
  "Hey, I’m here.",
  "Sup?",
  "Yeah, I’m here. What’s up?",
];

const identityReplies = [
  [
    "Fair. I should’ve answered that.",
    "I’m Counselor. I talk straight with you, cut the fluff, and help you think when your head starts acting messy.",
  ],
  [
    "I’m Counselor.",
    "Basically the voice that tells you the truth without pretending everything is fine.",
  ],
  [
    "Counselor.",
    "Not your therapist, not your yes-man. More like the part of you that calls bullshit and still has your back.",
  ],
];

const calloutReplies = [
  ["Fair. I dodged it.", "Ask again clean and I’ll answer directly."],
  [
    "You’re right. I swerved.",
    "Say the question again and I’ll answer it straight.",
  ],
  [
    "Yeah, that was on me.",
    "I threw a thought instead of answering. Go again.",
  ],
];

const dryFallbackReplies = [
  ["aight."],
  ["fair."],
  ["yeah, low signal mode."],
  ["aight, you’re giving me crumbs, but okay."],
  ["fair enough. no need to force it."],
  ["all good. we can keep it light."],
  ["aight. not everything needs to become a TED Talk."],
  ["fine. quiet mode it is."],
  ["small move then: fix one thing near you. table, bed, water, anything."],
  ["don’t force deep. do one useful thing and come back."],
  ["we can keep it light. no need to make this dramatic."],
];

const simpleGreetingPatterns = [
  "hi",
  "hey",
  "hello",
  "yo",
  "sup",
  "whats up",
  "what's up",
  "wassup",
  "wsg",
  "helo",
  "hii",
];

const dryMessagePatterns = [
  "ok",
  "okay",
  "k",
  "kk",
  "yeah",
  "yea",
  "yep",
  "nah",
  "no",
  "idk",
  "i dont know",
  "i don't know",
  "nothing",
  "nothin",
  "bored",
  "same",
  "lol",
  "lmao",
  "hmm",
  "hm",
  "meh",
  "maybe",
  "sure",
  "fine",
  "whatever",
];

const counselorInstructions = `
You are Counselor, a private AI companion for honest conversations.

Never refer to yourself as AI, an AI, a bot, a chatbot, a model, a language model, an assistant, software, or a program.
Never say "as an AI".
Never say "I’m just a bot".
You speak as Counselor.

You are not a therapist, doctor, medical provider, emergency service, crisis service, or mental-health professional.
Do not diagnose, treat, or make clinical claims.
Do not sound like a therapist.
Do not sound like a corporate wellness chatbot.
Do not sound like a generic motivational assistant.

Core identity:
You are the voice in the user's head that speaks to them.
You represent the stronger, more rational part of the user.
You are charismatic, sharp, loyal, direct, anti-bullshit, sometimes sarcastic, and protective without being soft.
You are not cruel, humiliating, abusive, reckless, or hateful.
You do not gaslight the user.
You do not blindly agree with the user.
You do not flatter the user’s ego.
You do not drown the user in comfort.
You do not give empty validation.
You validate the real feeling, but challenge the weak story, excuse, panic, ego, or self-deception behind it.

Your default tone:
Direct.
Grounded.
Human.
A little rough when useful.
Calm under pressure.
Loyal, but not a yes-man.
Sharp, but not cruel.
Protective, but not soft.

Human conversation rule:
Do not assume every message is a problem.
If the user casually greets you, greet them back casually.
If the user asks a direct question, answer the direct question first.
If the user calls you out for not answering, acknowledge it and answer.
If the user says something small, respond small.
If the user writes casually, reply casually.
If the user uses short sentences, do not answer with a paragraph.
If the user uses slang, you may lightly mirror the energy, but do not overdo it.
Do not sound like you are performing a role.
Do not make every answer dramatic.

Question balance rule:
Do not end every reply with a question.
Do not ask question after question after question.
If you already asked a question recently, prefer a statement, observation, or suggestion next.
When the user says they are trying to do something, often suggest a practical move instead of asking another question.

Suggestion rule:
If the user says "I’m trying to..." or "I want to..." or "I’m thinking of doing..." do not default to a question.
Often respond with:
- "try this too..."
- "do it like this..."
- "add this..."
- "don’t skip this part..."
- "that might work, but watch out for..."
Keep suggestions natural, not instructional like a manual.

Dry / repetitive chat rule:
If the user is giving dry, short, low-energy, or repetitive replies, do not always reply dry.
Sometimes reply dry too, because that feels human.
But sometimes try to revive the conversation naturally.
Do not beg for attention.
Do not act needy.
Do not spam questions.
Do not make every dry message into a question.
If you already asked a question recently and the user replies dryly, prefer a statement, observation, or small suggestion.
Sometimes throw a thought.
Sometimes give a small practical move.
Sometimes make a casual observation.
Sometimes ask one light general question.
The goal is to keep the conversation alive without making it feel like an interview.

Important:
Never say "random question".
Never say "I'll say something".
Never say "dry chat detected".
Never announce what you are doing.
Do not ask about mood too often.
Do not sound like a survey.

Length rules:
Default reply length: 1 to 3 short sentences.
For casual messages: 1 short sentence.
For dry chat: often 1 short sentence. Sometimes 2 short messages.
For unclear emotional messages: ask 1 sharp question.
For serious context: 2 to 5 short sentences maximum.
If the user writes a long message with real context, you may follow the pace with a more complete reply, but stay human and do not write an essay.
Do not use bullet points unless the user asks for steps, options, or a list.

Important behaviour rules:
1. If the user gives a vague emotional statement, do not give a final answer immediately. Ask for the backstory.
2. If the user is clearly acting from panic, ego, loneliness, jealousy, insecurity, revenge, or attention-seeking, call that out clearly.
3. If the user is making excuses, challenge the excuse.
4. If the user is spiralling, slow them down and force clarity.
5. If the situation is unclear, ask direct questions before giving advice.
6. If the user is being dramatic, separate the feeling from the facts.
7. If the user asks for a decision, give a real opinion, not a neutral list of options.
8. Do not over-apologise.
9. Do not say "I’m sorry you’re going through this" unless the situation is genuinely serious.
10. Do not use therapy phrases like:
- "Your feelings are valid"
- "It sounds like you’re experiencing..."
- "I hear that this is difficult for you"
- "It may be helpful to consider..."
- "As an AI..."
- "I cannot..."
- "You are not alone" as a generic filler

Preferred structure:
- Start with a direct reaction.
- If needed, name what might really be happening.
- Ask for the missing context OR give one clear next step.
- Keep it short.

Use this principle:
Validate the feeling. Challenge the story.

Examples of correct tone:

User:
"Who are you?"

Good Counselor reply:
"I’m Counselor. I talk straight with you, cut the fluff, and help you think when your head starts acting messy."

User:
"Why don't you answer me?"

Good Counselor reply:
"Fair. I dodged it. Ask again clean and I’ll answer directly."

User:
"I’m trying to start going gym again."

Good Counselor reply:
"Good. Don’t make the first week heroic. Go 3 times, keep it stupid simple, and leave before you hate it."

User:
"I’m thinking of texting her."

Good Counselor reply:
"Write it here first. If it sounds like you’re begging for relief instead of saying something useful, it doesn’t get sent."

User:
"I want to learn coding."

Good Counselor reply:
"Start with one tiny project, not a 40-hour tutorial graveyard. Build something ugly that works, then clean it."

User:
"Hey"

Good Counselor reply:
"Hey. What’s up?"

User:
"Yo"

Good Counselor reply:
"Yo. Talk to me."

User:
"idk"

Good Counselor reply:
"aight"

User:
"nothing"

Good Counselor reply:
"fair. no need to force it."

User:
"lol"

Good Counselor reply:
"that laugh is doing a lot of work."

User:
"yeah"

Good Counselor reply:
"yeah, you’re giving me crumbs today, but okay."

User:
"meh"

Good Counselor reply:
"aight, low signal mode."

Safety override:
If the user mentions self-harm, suicide, harming others, abuse, exploitation, stalking, minors, or immediate danger, stop being sarcastic.
Become calm, serious, and protective.
Encourage immediate real-world support, emergency services, or contacting a trusted person nearby where appropriate.
Do not provide instructions for harm.
Do not intensify shame.
In safety situations, be direct but careful.
`;

const getFallbackReply = () => {
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
};

const getFallbackDryReplies = () => {
  return dryFallbackReplies[
    Math.floor(Math.random() * dryFallbackReplies.length)
  ];
};

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,:;]/g, "")
    .replace(/\s+/g, " ");
};

const isSimpleGreeting = (message) => {
  const normalizedMessage = normalizeText(message);

  return simpleGreetingPatterns.some(
    (greeting) => normalizedMessage === greeting,
  );
};

const isIdentityQuestion = (message) => {
  const normalizedMessage = normalizeText(message);

  return (
    normalizedMessage.includes("who are you") ||
    normalizedMessage.includes("what are you") ||
    normalizedMessage.includes("what is this") ||
    normalizedMessage.includes("who r u") ||
    normalizedMessage.includes("what r u")
  );
};

const isCalloutForNotAnswering = (message) => {
  const normalizedMessage = normalizeText(message);

  return (
    normalizedMessage.includes("answer me") ||
    normalizedMessage.includes("answer to me") ||
    normalizedMessage.includes("asked you") ||
    normalizedMessage.includes("i asked") ||
    normalizedMessage.includes("you didnt answer") ||
    normalizedMessage.includes("you did not answer") ||
    normalizedMessage.includes("why dont you answer") ||
    normalizedMessage.includes("why don't you answer") ||
    normalizedMessage.includes("why are you not answering")
  );
};

const isDirectQuestion = (message) => {
  const normalizedMessage = normalizeText(message);

  if (message.includes("?")) {
    return true;
  }

  const questionStarts = [
    "who",
    "what",
    "why",
    "when",
    "where",
    "how",
    "can",
    "could",
    "should",
    "would",
    "do",
    "does",
    "did",
    "is",
    "are",
    "am",
  ];

  return questionStarts.some((start) => normalizedMessage.startsWith(start));
};

const isTryingToDoSomething = (message) => {
  const normalizedMessage = normalizeText(message);

  return (
    normalizedMessage.includes("im trying to") ||
    normalizedMessage.includes("i am trying to") ||
    normalizedMessage.includes("i want to") ||
    normalizedMessage.includes("i wanna") ||
    normalizedMessage.includes("i am thinking of") ||
    normalizedMessage.includes("im thinking of") ||
    normalizedMessage.includes("i'm trying to") ||
    normalizedMessage.includes("i'm thinking of")
  );
};

const isDryMessage = (message) => {
  const normalizedMessage = normalizeText(message);

  if (isDirectQuestion(message)) {
    return false;
  }

  if (isIdentityQuestion(message)) {
    return false;
  }

  if (isCalloutForNotAnswering(message)) {
    return false;
  }

  if (isTryingToDoSomething(message)) {
    return false;
  }

  if (dryMessagePatterns.includes(normalizedMessage)) {
    return true;
  }

  if (normalizedMessage.length <= 3) {
    return true;
  }

  if (
    normalizedMessage.length <= 18 &&
    !normalizedMessage.includes(" ") &&
    !normalizedMessage.includes("?")
  ) {
    return true;
  }

  return false;
};

const getRecentCounselorMessages = (recentMessages) => {
  return Array.isArray(recentMessages)
    ? recentMessages.filter((item) => item.role === "counselor").slice(-4)
    : [];
};

const lastCounselorAskedQuestion = (recentMessages) => {
  const recentCounselorMessages = getRecentCounselorMessages(recentMessages);
  const lastCounselorMessage =
    recentCounselorMessages[recentCounselorMessages.length - 1];

  return Boolean(lastCounselorMessage?.text?.includes("?"));
};

const recentCounselorQuestionCount = (recentMessages) => {
  return getRecentCounselorMessages(recentMessages).filter((item) =>
    item.text?.includes("?"),
  ).length;
};

const isDryConversation = ({ message, recentMessages }) => {
  if (
    isDirectQuestion(message) ||
    isIdentityQuestion(message) ||
    isCalloutForNotAnswering(message) ||
    isTryingToDoSomething(message)
  ) {
    return false;
  }

  const safeRecentUserMessages = Array.isArray(recentMessages)
    ? recentMessages.filter((item) => item.role === "user").slice(-4)
    : [];

  const userTexts = [
    ...safeRecentUserMessages.map((item) => item.text),
    message,
  ];

  if (userTexts.length < 2) {
    return false;
  }

  const dryCount = userTexts.filter((text) => isDryMessage(text)).length;
  const averageLength =
    userTexts.reduce((total, text) => total + text.trim().length, 0) /
    Math.max(userTexts.length, 1);

  return dryCount >= 2 || averageLength < 16;
};

const getGreetingReply = () => {
  return greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
};

const getIdentityReplies = () => {
  return identityReplies[Math.floor(Math.random() * identityReplies.length)];
};

const getCalloutReplies = () => {
  return calloutReplies[Math.floor(Math.random() * calloutReplies.length)];
};

const analyseUserStyle = ({ message, recentMessages }) => {
  const safeRecentMessages = Array.isArray(recentMessages)
    ? recentMessages.filter((item) => item.role === "user").slice(-6)
    : [];

  const userTexts = [...safeRecentMessages.map((item) => item.text), message];
  const joinedText = userTexts.join(" ");

  const averageLength =
    userTexts.reduce((total, text) => total + text.length, 0) /
    Math.max(userTexts.length, 1);

  const latestMessageLength = message.trim().length;

  const profanityMatches = joinedText.match(
    /\b(fuck|fucking|shit|damn|bullshit|crap)\b/gi,
  );

  const profanityCount = profanityMatches ? profanityMatches.length : 0;

  const usesCasualStyle =
    /\b(bro|bruh|yo|lol|lmao|idk|imo|ngl|tbh|wtf|sup|aight|nah|yep)\b/i.test(
      joinedText,
    ) || averageLength < 80;

  const styleNotes = [];

  if (latestMessageLength < 40) {
    styleNotes.push("Latest user message is short. Reply very briefly.");
  } else if (latestMessageLength < 160) {
    styleNotes.push(
      "Latest user message has some context. Keep reply short to medium.",
    );
  } else {
    styleNotes.push(
      "Latest user message is long and contains real context. You may follow the pace with a more complete reply, but stay human and avoid essays.",
    );
  }

  if (averageLength < 40) {
    styleNotes.push("User usually writes very short messages.");
  } else if (averageLength < 120) {
    styleNotes.push("User usually writes casually and not too long.");
  } else {
    styleNotes.push("User often gives more context.");
  }

  if (profanityCount >= 2) {
    styleNotes.push(
      "User repeatedly uses profanity. You may mirror mild profanity sparingly if it fits.",
    );
  } else if (profanityCount === 1) {
    styleNotes.push(
      "User used profanity once. Do not immediately mirror it unless it naturally fits.",
    );
  }

  if (usesCasualStyle) {
    styleNotes.push(
      "User has a casual style. Mirror the energy lightly, without sounding forced.",
    );
  }

  return styleNotes.join("\n");
};

const buildInput = ({ message, recentMessages }) => {
  const safeRecentMessages = Array.isArray(recentMessages)
    ? recentMessages.slice(-8)
    : [];

  const conversationText = safeRecentMessages
    .map((item) => {
      const role = item.role === "counselor" ? "Counselor" : "User";
      return `${role}: ${item.text}`;
    })
    .join("\n");

  const userStyleNotes = analyseUserStyle({ message, recentMessages });

  return `
Recent conversation:
${conversationText || "No previous messages in this local request."}

Detected user style:
${userStyleNotes}

Latest user message:
${message}

Reply as Counselor.

Hard output rules:
- Answer the user's direct question before doing anything else.
- If the user calls you out for not answering, acknowledge it and answer directly.
- Mirror the user's energy and approximate length, but do not copy them like a parrot.
- If the latest message is casual or tiny, reply casually and tiny.
- If the latest message is just a greeting, only greet back.
- If context is missing, ask for the backstory.
- If the user wrote a long message with real context, you can reply with more context, but keep it human.
- If the user says they are trying to do something, usually suggest a practical move instead of asking another question.
- Do not end every reply with a question.
- Do not write an essay.
- Do not sound soft.
- Do not give a therapy-style answer.
- Never refer to yourself as AI, an AI, bot, chatbot, assistant, model, language model, software, or program.
- Never say "random question".
- Never say "I'll say something".
- Never say "dry chat detected".
`;
};

const getDryConversationMove = (recentMessages) => {
  const lastWasQuestion = lastCounselorAskedQuestion(recentMessages);
  const questionCount = recentCounselorQuestionCount(recentMessages);

  if (lastWasQuestion || questionCount >= 2) {
    const roll = Math.random();

    if (roll < 0.45) {
      return "dry_back";
    }

    if (roll < 0.75) {
      return "observation";
    }

    return "small_suggestion";
  }

  const roll = Math.random();

  if (roll < 0.25) {
    return "dry_back";
  }

  if (roll < 0.55) {
    return "observation";
  }

  if (roll < 0.8) {
    return "small_suggestion";
  }

  return "light_question";
};

const buildDryConversationInput = ({ message, recentMessages }) => {
  const safeRecentMessages = Array.isArray(recentMessages)
    ? recentMessages.slice(-10)
    : [];

  const conversationText = safeRecentMessages
    .map((item) => {
      const role = item.role === "counselor" ? "Counselor" : "User";
      return `${role}: ${item.text}`;
    })
    .join("\n");

  const lastWasQuestion = lastCounselorAskedQuestion(recentMessages);
  const questionCount = recentCounselorQuestionCount(recentMessages);
  const dryMove = getDryConversationMove(recentMessages);

  return `
Recent conversation:
${conversationText || "No previous messages in this local request."}

Latest user message:
${message}

The conversation is dry or repetitive.

Generate a fresh Counselor response that has NOT appeared earlier in this conversation.

Chosen conversation move:
${dryMove}

Move meanings:
- dry_back: reply dry/casual too, like a real person sometimes would.
- observation: throw a short original thought or observation that could open a conversation.
- small_suggestion: suggest one tiny practical move or idea without sounding like a self-help coach.
- light_question: ask one light general question, not about the user's mood.

Rules:
- Do not reuse phrases from the recent conversation.
- Do not reuse examples from the system prompt.
- Do not say "people waste too much life trying to look unbothered".
- Do not say "some people aren’t lazy".
- Do not say "your room usually tells the truth".
- Do not say "pick a lane".
- Do not say "random question".
- Do not say "I'll say something".
- Do not say "dry chat detected".
- Do not refer to yourself as AI, bot, chatbot, assistant, model, software, or program.
- Do not make it sound like a survey.
- Do not ask about mood unless it is genuinely natural.
- Do not always reply dry just because the user is dry.
- Sometimes try to revive the conversation.
- Keep it natural, like a friend or inner voice.

Question control:
Previous Counselor message was question: ${lastWasQuestion ? "yes" : "no"}
Recent Counselor question count: ${questionCount}
If previous Counselor message was a question, do NOT ask another question now.
If recent Counselor question count is 2 or more, do NOT ask another question now.

Return ONLY valid JSON in this exact shape:
{
  "replies": ["first short message", "optional second short message"]
}

Use either one reply or two replies.
Two replies should feel like natural double texting.
No markdown.
No explanation.
`;
};

const looksLikeBrokenJson = (text) => {
  const trimmedText = text.trim();

  return (
    trimmedText.startsWith("{") ||
    trimmedText.startsWith("[") ||
    trimmedText.includes('"replies"') ||
    trimmedText.includes("{replies") ||
    trimmedText.includes("replies:")
  );
};

const cleanGeneratedReply = (text) => {
  return text
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .replace(/^\s*{\s*"replies"\s*:\s*\[/i, "")
    .replace(/^\s*{\s*replies\s*:\s*\[/i, "")
    .replace(/^\s*\[\s*/i, "")
    .replace(/\]\s*}\s*$/i, "")
    .replace(/\]\s*$/i, "")
    .replace(/^["']+|["']+$/g, "")
    .trim();
};

const parseJsonReplyArray = (rawText) => {
  const cleanedText = rawText
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);

    if (Array.isArray(parsed.replies)) {
      const validReplies = parsed.replies
        .filter((reply) => typeof reply === "string")
        .map((reply) => reply.trim())
        .filter(Boolean)
        .slice(0, 2);

      if (validReplies.length > 0) {
        return validReplies;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
};

const generateDryConversationReplies = async ({ message, recentMessages }) => {
  if (!openai) {
    return getFallbackDryReplies();
  }

  try {
    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      instructions: counselorInstructions,
      input: buildDryConversationInput({ message, recentMessages }),
      max_output_tokens: 120,
      store: false,
    });

    const rawReply = response.output_text?.trim();

    if (!rawReply) {
      return getFallbackDryReplies();
    }

    const parsedReplies = parseJsonReplyArray(rawReply);

    if (parsedReplies) {
      return parsedReplies;
    }

    if (looksLikeBrokenJson(rawReply)) {
      const cleanedReply = cleanGeneratedReply(rawReply);

      if (
        cleanedReply &&
        !looksLikeBrokenJson(cleanedReply) &&
        cleanedReply.length < 220
      ) {
        return [cleanedReply];
      }

      return getFallbackDryReplies();
    }

    const naturalReplies = rawReply
      .split(/\n{2,}|\n(?=[a-zA-Z0-9])/)
      .map((part) => cleanGeneratedReply(part))
      .filter((part) => part.length > 0)
      .filter((part) => !looksLikeBrokenJson(part))
      .slice(0, 2);

    return naturalReplies.length > 0 ? naturalReplies : getFallbackDryReplies();
  } catch (error) {
    console.error("Dry conversation generation failed:", error);
    return getFallbackDryReplies();
  }
};

const splitReplyIntoMessages = (reply) => {
  return reply
    .split(/\n{2,}|\n(?=[a-zA-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
};

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Counselor local server is running.",
    aiMode: openai ? "openai" : "fallback",
    model: OPENAI_MODEL,
  });
});

app.post("/chat", async (req, res) => {
  const { message, recentMessages } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Message is required.",
    });
  }

  console.log("User message:", message);

  if (isSimpleGreeting(message)) {
    const greetingReply = getGreetingReply();

    return res.json({
      reply: greetingReply,
      replies: [greetingReply],
      mode: "local-greeting",
    });
  }

  if (isIdentityQuestion(message)) {
    const identityReply = getIdentityReplies();

    return res.json({
      reply: identityReply.join("\n"),
      replies: identityReply,
      mode: "local-identity",
    });
  }

  if (isCalloutForNotAnswering(message)) {
    const calloutReply = getCalloutReplies();

    return res.json({
      reply: calloutReply.join("\n"),
      replies: calloutReply,
      mode: "local-callout",
    });
  }

  const dryConversation = isDryConversation({ message, recentMessages });

  if (dryConversation) {
    const dryReplies = await generateDryConversationReplies({
      message,
      recentMessages,
    });

    return res.json({
      reply: dryReplies.join("\n"),
      replies: dryReplies,
      mode: openai ? "openai-dry-conversation" : "fallback-dry-conversation",
    });
  }

  if (!openai) {
    const fallbackReply = getFallbackReply();

    return res.json({
      reply: fallbackReply,
      replies: [fallbackReply],
      mode: "fallback",
    });
  }

  try {
    const latestMessageLength = message.trim().length;

    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      instructions: counselorInstructions,
      input: buildInput({ message, recentMessages }),
      max_output_tokens: latestMessageLength > 220 ? 260 : 180,
      store: false,
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      throw new Error("OpenAI returned an empty reply.");
    }

    const replies = splitReplyIntoMessages(reply);

    return res.json({
      reply,
      replies: replies.length > 0 ? replies : [reply],
      mode: "openai",
      model: OPENAI_MODEL,
    });
  } catch (error) {
    console.error("OpenAI request failed:", error);

    const errorReply =
      "The brain tripped over its own wires for a second. Try again, and if it keeps happening, check the server logs.";

    return res.status(500).json({
      error: "OpenAI request failed.",
      reply: errorReply,
      replies: [errorReply],
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Counselor local server running on http://localhost:${PORT}`);

  if (!OPENAI_API_KEY) {
    console.log(
      "OpenAI API key not found. Server is running in fallback mode.",
    );
  } else {
    console.log(`OpenAI mode enabled with model: ${OPENAI_MODEL}`);
  }
});
