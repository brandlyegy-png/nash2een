import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ صفحة البداية (اختيارية)
app.get("/", (req, res) => {
  res.send("✅ Facebook Messenger Bot is running!");
});

// ✅ للتحقق من Webhook عند الربط مع Facebook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "123456"; // استبدلها بنفس التوكين اللي استخدمته في إعداد Webhook
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ استقبال الرسائل من فيسبوك
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const webhookEvent = entry.messaging[0];
      console.log("Received message:", webhookEvent.message?.text, "from", webhookEvent.sender.id);

      const senderId = webhookEvent.sender.id;
      const messageText = webhookEvent.message?.text || "";

      // ✅ رد تلقائي بسيط
      if (messageText) {
        await sendMessage(senderId, " 0000 أهلاً بك 👋! شكرًا على رسالتك 😊");
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// ✅ دالة إرسال الرسائل إلى المستخدمين
async function sendMessage(senderId, text) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text },
        }),
      }
    );

    const data = await response.json();
    console.log("Send message response:", data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// ✅ شغل السيرفر على Vercel
app.listen(3000, () => console.log("✅ Server is running on port 3000"));

export default app;
