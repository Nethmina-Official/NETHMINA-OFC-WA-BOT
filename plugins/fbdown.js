const { cmd, commands } = require("../command");
const { default: getFbVideoInfo } = import("fb-downloader-scrapper");

cmd(
  {
    pattern: "fb",
    alias: ["facebook","fbdl"],
    react: "🔖",
    desc: "Download Facebook Video",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("*Please provide a valid Facebook video URL! 🌐*");

      // Validate the Facebook URL format
      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q))
        return reply("*‼ Invalid Facebook URL! Please check and try again. ‼*");

      // Fetch video details
      reply("*Downloading your video...⬇️*");

      const result = await getFbVideoInfo(q);

      if (!result || (!result.sd && !result.hd)) {
        return reply("*Failed to download video. Please try again later. 📛*");
      }

      const { title, sd, hd } = result;

      // Prepare and send the message with video details
      let desc = `
      *📹 NETHMINA OFC FB DOWNLODER 📹*

      *📍 Title :*
      
      *🎨 Quality : *${hd ? "HD Available" : "SD Only"}
      
      > ©  ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ᴡᴀ-ʙᴏᴛ ||
        `;
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/VYHLZ8Cv/my-data.jpg",
          },
          caption: desc,
        },
        { quoted: mek }
      );
      // Send the video if available
      if (hd) {
        await robin.sendMessage(
          from,
          { video: { url: hd }, caption: "----------HD VIDEO----------" },
          { quoted: mek }
        );
        await robin.sendMessage(
          from,
          { video: { url: sd }, caption: "----------SD VIDEO----------" },
          { quoted: mek }
        );
      } else if (sd) {
        await robin.sendMessage(
          from,
          { video: { url: sd }, caption: "----------SD VIDEO----------" },
          { quoted: mek }
        );
      } else {
        return reply("*No downloadable video found!* 🌚");
      }

      return reply("*Video uploaded done! ✅*");
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
