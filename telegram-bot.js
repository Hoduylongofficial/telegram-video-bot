import { Telegraf } from "telegraf";
import { generateVideo } from "./generate-video.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.warn("⚠️ Cảnh báo: Chưa cấu hình TELEGRAM_BOT_TOKEN trong file .env!");
  console.warn("Vui lòng thiết lập biến này trước khi chạy Bot.");
}

const bot = new Telegraf(botToken || "DUMMY_TOKEN");

// Command /start
bot.start((ctx) => {
  ctx.reply(
    "👋 Xin chào! Tôi là Bot tự động tạo Video Short.\n\n" +
    "💬 Hãy gửi cho tôi kịch bản hoặc ý tưởng của bạn (bằng Tiếng Việt hoặc Tiếng Anh).\n" +
    "Tôi sẽ sử dụng AI để mở rộng kịch bản, tạo giọng đọc, chạy phụ đề karaoke và dựng thành video ngắn hoàn chỉnh gửi lại cho bạn! 🎬"
  );
});

// Listener for text prompts
bot.on("text", async (ctx) => {
  const prompt = ctx.message.text;
  
  if (!process.env.GEMINI_API_KEY) {
    return ctx.reply("❌ Lỗi: Chưa cấu hình GEMINI_API_KEY trong file .env. Vui lòng thiết lập khóa API.");
  }
  
  if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === "DUMMY_TOKEN") {
    return ctx.reply("❌ Lỗi: Chưa cấu hình TELEGRAM_BOT_TOKEN hợp lệ.");
  }

  let statusMsg;
  try {
    statusMsg = await ctx.reply("🤖 Đã nhận kịch bản. Đang bắt đầu xử lý...");
    
    const updateStatus = async (text) => {
      try {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          text
        );
      } catch (err) {
        // Ignore duplicate edit errors
      }
    };
    
    // Run the video generation pipeline
    const videoPath = await generateVideo(prompt, updateStatus);
    
    // Send the video back
    await updateStatus("📤 Đang tải video lên Telegram...");
    await ctx.replyWithVideo(
      { source: videoPath },
      { 
        caption: `🎉 Video của bạn đã dựng xong!\n\n💡 Ý tưởng gốc: "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"`,
        reply_to_message_id: ctx.message.message_id
      }
    );
    
    // Clean up local video file to save disk space
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log(`Cleared rendered file to save disk: ${videoPath}`);
    }
    
    await updateStatus("✨ Đã hoàn thành và dọn dẹp bộ nhớ!");
    
  } catch (error) {
    console.error("Bot Generation Error:", error);
    const errorMessage = `❌ Đã xảy ra lỗi trong quá trình dựng video:\n\n${error.message}`;
    if (statusMsg) {
      try {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          statusMsg.message_id,
          null,
          errorMessage
        );
      } catch (err) {
        await ctx.reply(errorMessage);
      }
    } else {
      await ctx.reply(errorMessage);
    }
  }
});

// Start bot
if (botToken && botToken !== "DUMMY_TOKEN") {
  bot.launch()
    .then(() => console.log("🤖 Telegram Bot has started successfully! Listening for messages..."))
    .catch((err) => console.error("Failed to start Telegram Bot:", err));
}

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
