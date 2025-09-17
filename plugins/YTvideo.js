const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
  {
    pattern: "video",
    alias: ["ytvideo","ytmp4"],
    react: "🎥",
    desc: "Download YouTube Video",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Please provide a name or a URL. ‼");

      // Search for the video
      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      // Video metadata description
      let desc = `
*🎬❤️ NETHMINA VIDEO DOWNLOADER ❤️🎬*

┌───────────────────
├ *📹 Title:* ${data.title}
├ *⏱️ Duration:* ${data.timestamp}
├ *📆 Uploaded:* ${data.ago}
├ *👁️ Views:* ${data.views}
├ *👍 Likes:* ${data.likes || "N/A"}
├ *📡 Channel:* ${data.author.name || "Unknown"}
├ *🔗 Watch/Download:* ${data.url}
├ *📥 Size:* ${data.size}
└───────────────────

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||
`;

      // Send metadata and thumbnail message
      await robin.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );

      // Video download function
      const downloadVideo = async (url, quality) => {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${quality}&url=${encodeURIComponent(
          url
        )}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.success) {
          const { id, title } = response.data;

          // Wait for download URL generation
          const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
          while (true) {
            const progress = await axios.get(progressUrl);
            if (progress.data.success && progress.data.progress === 1000) {
              const videoBuffer = await axios.get(progress.data.download_url, {
                responseType: "arraybuffer",
              });
              return { buffer: videoBuffer.data, title };
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        } else {
          throw new Error("Failed to fetch video details.");
        }
      };

      // Specify desired quality (default: 720p)
      const quality = "720";

      // Download and send video
      const video = await downloadVideo(url, quality);
      await robin.sendMessage(
        from,
        {
          video: video.buffer,
          caption: `🎥 *${video.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||`,
        },
        { quoted: mek }
      );
// Send as a document (optional)
await robin.sendMessage(
  from,
  {
    document: { url: songData.download.url },
    mimetype: "video/mp4",
    fileName: `${data.title}.mp4`,
    caption: "> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||",
  },
  { quoted: mek }
);

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
