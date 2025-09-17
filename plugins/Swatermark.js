const { cmd } = require("../command");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadMediaMessage } = require("../lib/msg.js"); // Adjust the path

cmd(
  {
    pattern: "wm",
    alias: ["watermark"],
    react: "✨",
    desc: "Change sticker watermark (pack name and author)",
    category: "convert",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      q,
      reply,
    }
  ) => {
    try {
      // Ensure the replied message is a sticker
      if (!quoted || !quoted.stickerMessage) {
        return reply("❌ Please reply to a sticker to change its watermark.");
      }

      // Ensure watermark text is provided
      if (!q || !q.includes("|")) {
        return reply("❌ Usage: .wm <packname|author>\nExample: .wm Cool Pack|John Doe");
      }

      // Parse pack name and author
      const [packName, authorName] = q.split("|").map(s => s.trim());
      if (!packName || !authorName) {
        return reply("❌ Please provide both pack name and author name.");
      }

      // Download the sticker
      const media = await downloadMediaMessage(quoted, "stickerWatermark");
      if (!media) return reply("⚠️ Failed to download the sticker. Try again.");

      // Recreate sticker with new watermark
      const sticker = new Sticker(media, {
        pack: packName,
        author: authorName,
        type: StickerTypes.FULL,
        quality: 70,
      });

      const buffer = await sticker.toBuffer();

      // Send the new sticker
      await robin.sendMessage(from, { sticker: buffer }, { quoted: mek });

    } catch (e) {
      console.error("Watermark error:", e);
      reply(`❌ Error: ${e.message || e}`);
    }
  }
);
