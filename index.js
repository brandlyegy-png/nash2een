import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// حط هنا رمز التحقق اللي هتكتبه فى فيسبوك
const VERIFY_TOKEN = "my_verify_token_123";

// المسار الخاص بالتحقق من الـ Webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// استقبال الرسائل من Messenger
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const event = entry.messaging[0];
      const senderId = event.sender.id;

      if (event.message && event.message.text) {
        const text = event.message.text;
        console.log(`Received message: ${text} from ${senderId}`);
        sendMessage(senderId, "أهلاً بك 👋! شكرًا على رسالتك 😊");
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// دالة لإرسال الرسالة إلى المستخدم
async function sendMessage(senderId, message) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; // نخليها متغير بيئة فى Vercel

  await fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text: message },
    }),
  });
}

app.listen(3000, () => console.log("Bot is running"));
