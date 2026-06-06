// PM2 Ecosystem Configuration
// Chạy: pm2 start ecosystem.config.js
const path = require("path");
const PROJECT_DIR = __dirname;

module.exports = {
  apps: [
    {
      name: "video-bot",
      script: path.join(PROJECT_DIR, "telegram-bot.js"),
      interpreter: "node",
      cwd: PROJECT_DIR,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1500M",
      kill_timeout: 600000,  // Chờ 10 phút trước khi force kill (đủ thời gian render)
      env: {
        NODE_ENV: "production",
      },
      // Restart after crash with delay
      restart_delay: 10000,
      // Log file configuration
      out_file: path.join(PROJECT_DIR, "logs", "bot-out.log"),
      error_file: path.join(PROJECT_DIR, "logs", "bot-err.log"),
      log_file: path.join(PROJECT_DIR, "logs", "bot-combined.log"),
      time: true,
    },
  ],
};
