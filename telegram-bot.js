import { Telegraf } from "telegraf";
import { generateVideo } from "./generate-video.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.warn("⚠️ Cảnh báo: Chưa cấu hình TELEGRAM_BOT_TOKEN trong file .env!");
}

const bot = new Telegraf(botToken || "DUMMY_TOKEN", {
  handlerTimeout: 10 * 60 * 1000, // 10 phút timeout cho handler
});

// Queue để xử lý tuần tự (tránh chạy 2 video cùng lúc, hết RAM)
let isProcessing = false;
const queue = [];

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const { ctx, prompt, statusMsg } = queue.shift();

  const updateStatus = async (text) => {
    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        null,
        text
      );
    } catch (_) {}
  };

  try {
    const videoPath = await generateVideo(prompt, updateStatus);

    await updateStatus("📤 Đang tải video lên Telegram...");
    await ctx.replyWithVideo(
      { source: videoPath },
      {
        caption: `🎉 Video của bạn đã dựng xong!\n\n💡 Ý tưởng: "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"`,
        reply_to_message_id: ctx.message.message_id,
      }
    );

    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log(`Cleared rendered file: ${videoPath}`);
    }

    await updateStatus("✨ Đã hoàn thành! Gửi kịch bản mới để tạo video tiếp.");

  } catch (error) {
    console.error("Bot Generation Error:", error);
    const errorMessage = `❌ Lỗi trong quá trình dựng video:\n\n${error.message.slice(0, 300)}`;
    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id, statusMsg.message_id, null, errorMessage
      );
    } catch (_) {
      await ctx.reply(errorMessage).catch(() => {});
    }
  } finally {
    isProcessing = false;
    // Tiếp tục xử lý queue nếu còn
    setTimeout(processQueue, 500);
  }
}

// Command /start
bot.start((ctx) => {
  ctx.reply(
    "👋 Xin chào! Tôi là Bot tự động tạo Video Short.\n\n" +
    "💬 Hãy gửi cho tôi kịch bản hoặc ý tưởng của bạn (Tiếng Việt hoặc Tiếng Anh).\n" +
    "🎬 Tôi sẽ tạo giọng đọc, phụ đề karaoke và dựng video ngắn gửi lại cho bạn!\n\n" +
    "⏱️ Thời gian xử lý: ~3-5 phút mỗi video."
  );
});

// Command /status
bot.command("status", (ctx) => {
  if (isProcessing) {
    ctx.reply(`⚙️ Đang xử lý video...\n📋 Hàng chờ: ${queue.length} yêu cầu`);
  } else {
    ctx.reply(`✅ Bot sẵn sàng!\n📋 Hàng chờ: ${queue.length} yêu cầu`);
  }
});

// Listener for text prompts
bot.on("text", async (ctx) => {
  const prompt = ctx.message.text;

  // Bỏ qua nếu là lệnh /
  if (prompt.startsWith("/")) return;

  if (!process.env.GEMINI_API_KEY) {
    return ctx.reply("❌ Lỗi: Chưa cấu hình GEMINI_API_KEY.");
  }

  // Giới hạn queue tối đa 3
  if (queue.length >= 3) {
    return ctx.reply("⚠️ Hàng chờ đầy (3 yêu cầu). Vui lòng chờ video hiện tại xong.");
  }

  let statusMsg;
  try {
    const queuePos = queue.length + (isProcessing ? 1 : 0);
    const waitMsg = queuePos > 0
      ? `\n⏳ Vị trí hàng chờ: ${queuePos + 1}`
      : "\n🚀 Đang bắt đầu xử lý...";

    statusMsg = await ctx.reply(`🤖 Đã nhận kịch bản!${waitMsg}`);

    queue.push({ ctx, prompt, statusMsg });
    processQueue();

  } catch (error) {
    console.error("Queue Error:", error);
    await ctx.reply("❌ Lỗi khi thêm vào hàng chờ.").catch(() => {});
  }
});

// Start bot
if (botToken && botToken !== "DUMMY_TOKEN") {
  bot.launch({
    dropPendingUpdates: true, // Bỏ qua các message cũ khi restart
  })
    .then(() => console.log("🤖 Telegram Bot has started successfully! Listening for messages..."))
    .catch((err) => console.error("Failed to start Telegram Bot:", err));
}

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
