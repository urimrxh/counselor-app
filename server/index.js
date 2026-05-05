import cors from "cors";
import express from "express";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const fakeReplies = [
  "Alright, back up. Give me the backstory before we start pretending this is a clean decision.",
  "Slow down. What actually happened here? Not the dramatic trailer version, the real version.",
  "Before I call bullshit or back you up, I need context. Who did what, and what are you hoping happens next?",
  "Okay. Tell me the ugly version first. What happened, what did you do, and what are you avoiding admitting?",
  "Hold on. Are you trying to solve the problem, or are you trying to get a quick emotional hit? Give me the backstory.",
  "Fine, but start from the beginning. I am not handing you advice based on half a sentence and panic.",
  "Good. Say it properly. What happened, why does it still have a grip on you, and what do you want from this?",
];

const getRandomReply = () => {
  return fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
};

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Counselor local server is running.",
  });
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Message is required.",
    });
  }

  console.log("User message:", message);

  return res.json({
    reply: getRandomReply(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Counselor local server running on http://localhost:${PORT}`);
});
