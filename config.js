const fs = require("fs");
if (fs.existsSync("config.env"))
  require("dotenv").config({ path: "./config.env" });

function convertToBool(text, fault = "true") {
  return text === fault ? true : false;
}
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "Yf1XzAAa#duBbCz5aIoxo7W0os1WdYitucc0UUpXmhZT7Wyi7Sd8",
  OWNER_NUM: process.env.OWNER_NUM || "94789086040",
  PREFIX: process.env.PREFIX || ".",
  ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/VYHLZ8Cv/my-data.jpg",
  ALIVE_MSG: process.env.ALIVE_MSG || "Hello , I am alive now!!\n\n> NETHMINA OFC WA-BOT",
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
  MODE: process.env.MODE || "inbox",
  AUTO_VOICE: process.env.AUTO_VOICE || "true",
  AUTO_REPLY: process.env.AUTO_REPLY || "true",
  AUTO_STICKER: process.env.AUTO_STICKER || "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyD3QOKw00CNxUmUQ1RE5gpwaoHG2a4NbkQ",
  MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|d8f39581f1cde7b8dbe825f3db3fd650154cd226",
  
};
