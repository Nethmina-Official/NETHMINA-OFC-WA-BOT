const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const {runtime} = require('../lib/functions')
cmd({
    pattern: "system",
    react: "⚖",
    alias: ["status","botinfo"],
    desc: "Chech up time , ram usage and more",
    category: "main",
    filename: __filename
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

let status = `
*⚖ NETHMINA OFC WABOT STATUS ⚖*

┌──────────────────────────
├ *⏰ Uptime:* ${runtime(process.uptime())}
├ *📟 Ram usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
├ *⚙️ HostName:* ${os.hostname()}
├ *👨‍💻 Owner:* Nethmina OFC ( Bhashitha Nethmina )
└──────────────────────────

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||
`
await robin.sendPresenceUpdate('recording', from);
      await robin.sendMessage(from, { audio: { url: "https://github.com/Official-Nethmina/NETHMINA-OFC-WABOT/raw/refs/heads/main/data/bot.mp3" }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
      await robin.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/VYHLZ8Cv/my-data.jpg",
          },
          caption: status,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);
