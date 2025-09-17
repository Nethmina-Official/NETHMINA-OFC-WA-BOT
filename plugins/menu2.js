const { cmd, commands } = require("../command");
const config = require('../config');
const os = require("os")
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd(
  {
    pattern: "menu2",
    desc: "get sec menu",
    react: "📜",
    category: "main",
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
      
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

let madeMenu = `
*𝐍𝐄𝐓𝐇𝐌𝐈𝐍𝐀 𝐎𝐅𝐂 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐁𝐎𝐓*

*Hᴇʟʟᴏ.... ${pushname}👋*
*I'ᴍ Aʟɪᴠᴇ Nᴏᴡ...🙋‍♂💗*
      
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ 𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴 - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
│◈ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 - ${runtime(process.uptime())}
│◈ 𝙿𝚁𝙴𝙵𝙸𝚇 - [ ${config.PREFIX} ]
╰──────────●●►      
      
*╭──❮ DOWNLOAD COMMANDS ❯*
│
│📖 COMMAND: .play
│ℹ️ Download Audio from yt
│ 
│📖 COMMAND: .song
│ℹ️ Download song from yt
│ 
│📖 COMMAND: .apk
│ℹ️ Download apk from playstore
│ 
│📖 COMMAND: .video
│ℹ️ Download video from yt
│ 
│📖 COMMAND: .fb
│ℹ️ Download  video from fb
│ 
│📖 COMMAND: .tk
│ℹ️ Download video from tiktok
│ 
│📖 COMMAND: .ig
│ℹ️ Download video from ig
│ 
│📖 COMMAND: .gdrive
│ℹ️ Download drive files
│ 
│📖 COMMAND: .wamod
│ℹ️ Download wamod apk
│
│📖 COMMAND: .img
│ℹ️ Download image
│
│📖 COMMAND: .darama
│ℹ️ Download full episode video
╰────────────⦁ 

*╭──❮ SEARCH COMMANDS ❯*
│
│📖 COMMAND: .yts
│ℹ️ Serch videos from yt
╰────────────⦁  

*╭──❮‍ MAIN COMMANDS ❯*
│
│📖 COMMAND: .alive
│ℹ️ Check online or not
│  
│📖 COMMAND: .ping
│ℹ️ Check bot speed
│  
│📖 COMMAND: .menu
│ℹ️ Nero main menu
│
│📖 COMMAND: .menu2
│ℹ️ Nero main menu2
│ 
│📖 COMMAND: .ai
│ℹ️ chat with ai bot
│
│📖 COMMAND: .system
│ℹ️ check bot systems
│
│📖 COMMAND: .owner
│ℹ️ get owner info
│ 
│📖 COMMAND: .status
│ℹ️ check bot runtime
╰────────────⦁

*╭──❮ OTHER COMMANDS ❯*
│
│📖 COMMAND: .hirunews/news
│ℹ️ Get news result for life
│ 
│📖 COMMAND: .wabeta
│ℹ️ Get whatsapp beta news
│
│📖 COMMAND: .sitech
│ℹ️ Get tech news
│ 
│📖 COMMAND: .nasa
│ℹ️ Get nasa news
╰────────────⦁

*╭──❮ GROUP COMMANDS ❯*
│
│📖 COMMAND: .mute
│ℹ️ Mute group
│
│📖 COMMAND: .unmute
│ℹ️ Unmute group
│
│📖 COMMAND: .left
│ℹ️ left group
│
│📖 COMMAND: .jid
│ℹ️ group jid
╰────────────⦁

*╭──❮ OWNER COMMANDS ❯*
│
│📖 COMMAND: .update
│ℹ️ update bot velue 
│
│📖 COMMAND: .restart 
│ℹ️ restart your bot
╰────────────⦁

*╭──❮ CONVERT COMMANDS ❯*
│
│📖 COMMAND: .sticker
│ℹ️ convert photo to sticker
╰────────────⦁

┏━━━━━━━━━━━━━━━━━━━━━━━━━━      
> *Contact owner : https://wa.me/message/5AWGRCFVNFAPE1*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━
      
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰꜰɪᴄɪᴀʟ ᴄᴏᴍᴍᴜɴɪᴛʏ

╰━❁ ═══ ❃•⇆•❃ ═══ ❁━╯
`;

      await robin.sendPresenceUpdate('recording', from);
      await robin.sendMessage(from, { audio: { url: "https://github.com/Nethmina-Official/NETHMINA-OFC-WA-BOT/raw/refs/heads/main/data/audio/any1.m4a" }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/VYHLZ8Cv/my-data.jpg",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
