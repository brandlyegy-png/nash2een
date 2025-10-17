import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ تحقق من Webhook من فيسبوك
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "zen123"; // غيرها لو عايز بكلمة سر خاصة بيك
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✅ استقبال الرسائل من فيسبوك
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      const event = entry.messaging[0];
      const senderId = event.sender.id;

      if (event.message && event.message.text) {
        const text = event.message.text.trim();

        switch (text) {
          case "1":
            await sendText(senderId, branchAbbasia());
            break;
          case "2":
            await sendText(senderId, branchMasrGdeda());
            break;
          case "3":
            await sendText(senderId, branchGiza());
            break;
          case "4":
            await sendText(senderId, branchQalyoubia());
            break;
          case "0":
            await sendQuickMenu(senderId);
            break;
          default:
            await sendQuickMenu(senderId);
        }
      }
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ✅ رسائل الفروع
function branchAbbasia() {
  return `لو هتشرفني يوم الاثنين القادم

مواعيد التدريبات من مواليد ٢٠١٣ حتي ٢٠٢١
الساعة ٦.٣٠ مساءا يومي الاثنين والخميس
———————————————
ومن مواليد ٩٩ حتي ٢٠١٢
الساعة ٨ مساءا يومي الاثنين والخميس

📍 العنوان: كلية الهندسة بالعباسية بجوار محطة مترو عبده باشا
📍 اللوكيشن: https://maps.app.goo.gl/Z4D3wVnHZ2Sk613Y7

💰 الاشتراك بعد الخصم 400 ✅
💰 الطقم بعد الخصم 250 ✅
💥 الإجمالي 650 🔥 بدلا من 750 ❌
الخصم علي الشهر الاول 🤝
الخصم لمدة اسبوع فقط 🚨‼️`;
}

function branchMasrGdeda() {
  return `لو هتشرفني التمرين الجي ارجو التاكيد

📅 مواليد ٢٠١١–٢٠٢٢: الجمعة ٨ م والثلاثاء ٨ م
📅 مواليد ٩٩–٢٠١٠: الجمعة ٨ م والثلاثاء ٨ م

📍 العنوان: ملاعب الليسية الفرنسية امام نادي الجلاء
📍 اللوكيشن: https://maps.app.goo.gl/QeVKAaMvtFCmPCwK9

💰 الاشتراك بعد الخصم 400 ✅
💰 الطقم بعد الخصم 250 ✅
💥 الإجمالي 650 🔥 بدلا من 750 ❌`;
}

function branchGiza() {
  return `لو هتشرفني التمرين الجي ارجو التاكيد

📅 مواليد ٢٠١٣–٢٠٢٢: الأحد ٨ م والخميس ٧ م
📅 مواليد ٩٩–٢٠١٢: الأحد ٩ م والخميس ٨ م

📍 العنوان: ملعب تربية رياضية فيصل بشارع فيصل الرئيسي امام ڤودافون
📍 اللوكيشن: https://maps.app.goo.gl/DP5fs7hZsSQzh2bD8

💰 الاشتراك بعد الخصم 400 ✅
💰 الطقم بعد الخصم 250 ✅
💥 الإجمالي 650 🔥 بدلا من 750 ❌`;
}

function branchQalyoubia() {
  return `هستأذنك تتواصل مع كابتن محمد العطار مسؤول فرع بنها
📞 +20 12 00931729

للقائمة الرئيسية اضغط 0`;
}

// ✅ إرسال رسالة نصية
async function sendText(senderId, text) {
  const token = process.env.PAGE_ACCESS_TOKEN;
  await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text },
    }),
  });
}

// ✅ القائمة الرئيسية
async function sendQuickMenu(senderId) {
  const token = process.env.PAGE_ACCESS_TOKEN;
  const message = {
    text: `مع حضرتك كابتن زين مدير التسويق في ناشئين مصر 🤝

قطاع ناشئين مصر موجودين فين 🇪🇬
اختر أقرب فرع ليك 👇`,
    quick_replies: [
      { content_type: "text", title: "1️⃣ العباسية", payload: "1" },
      { content_type: "text", title: "2️⃣ مصر الجديدة", payload: "2" },
      { content_type: "text", title: "3️⃣ الجيزة (فيصل)", payload: "3" },
      { content_type: "text", title: "4️⃣ بنها", payload: "4" },
    ],
  };

  await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderId },
      message,
    }),
  });
}

app.listen(3000, () => console.log("✅ Webhook running on port 3000"));
