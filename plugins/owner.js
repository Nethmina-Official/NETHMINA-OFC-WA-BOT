const { cmd ,commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const {sleep} = require('../lib/functions')

// 1. Block User
cmd({
    pattern: "block",
    desc: "Block a user.",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted) return reply("❌ Please reply to the user you want to block.");
    const user = quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'block');
        reply(`🚫 User ${user} blocked successfully.`);
    } catch (error) {
        reply(`❌ Error blocking user: ${error.message}`);
    }
});
// 2. Unblock User
cmd({
    pattern: "unblock",
    desc: "Unblock a user.",
    category: "owner",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted) return reply("❌ Please reply to the user you want to unblock.");
    const user = quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'unblock');
        reply(`✅ User ${user} unblocked successfully.`);
    } catch (error) {
        reply(`❌ Error unblocking user: ${error.message}`);
    }
});

// 3.kick group from user
cmd({
    pattern: "kick",
    alias: ["remove",".."],
    react: "⛔",
    desc: "Remove a mentioned user from the group.",
    category: "group",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, quoted }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user issuing the command is an admin
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Ensure a user is mentioned
        if (!quoted) return reply("⚠️ Please reply to the user's message you want to kick!");

        // Get the target user to remove
        const target = quoted.sender;

        // Ensure the target is not another admin
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);

        if (groupAdmins.includes(target)) {
            return reply("⚠️ I cannot remove another admin from the group!");
        }

        // Kick the target user
        await robin.groupParticipantsUpdate(from, [target], "remove");

        // Confirm the action
        return reply(`✅ Successfully removed: @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Kick Error:", e);
        reply(`❌ Failed to remove the user. Error: ${e.message}`);
    }
});

// 4. left group
cmd({
    pattern: "left",
    alias: ["leave", "exit"],
    react: "👋",
    desc: "Leave the current group.",
    category: "owner",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isOwner, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user is the bot owner
        if (!isOwner) return reply("⚠️ Only the owner can use this command!");

        // Leave the group
        await robin.groupLeave(from);

        // Confirm leaving
        console.log(`✅ Successfully left the group: ${from}`);
    } catch (e) {
        console.error("Leave Error:", e);
        reply(`❌ Failed to leave the group. Error: ${e.message}`);
    }
});


// 5. lock group
cmd({
    pattern: "mute",
    alias: ["silence", "lock","close"],
    react: "🔒",
    desc: "Set group chat to admin-only messages.",
    category: "group",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user is an admin
        if (!isAdmins) return reply("⚠️ This command is only for group admins!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Set the group to admin-only
        await robin.groupSettingUpdate(from, "announcement");

        // Confirm the action
        return reply("✅ Group has been muted. Only admins can send messages now!");
    } catch (e) {
        console.error("Mute Error:", e);
        reply(`❌ Failed to mute the group. Error: ${e.message}`);
    }
});

// 6. unlock group
cmd({
    pattern: "unmute",
    alias: ["unlock","open"],
    react: "🔓",
    desc: "Allow everyone to send messages in the group.",
    category: "group",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user is an admin
        if (!isAdmins) return reply("⚠️ This command is only for group admins!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Set the group to everyone can message
        await robin.groupSettingUpdate(from, "not_announcement");

        // Confirm the action
        return reply("✅ Group has been unmuted. Everyone can send messages now!");
    } catch (e) {
        console.error("Unmute Error:", e);
        reply(`❌ Failed to unmute the group. Error: ${e.message}`);
    }
});

// 7. add member
cmd({
    pattern: "add",
    alias: ["invite"],
    react: "➕",
    desc: "Add a user to the group.",
    category: "group",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, args }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user issuing the command is an admin
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Ensure a phone number or user ID is provided
        if (!args[0]) return reply("⚠️ Please provide the phone number of the user to add!");

        // Parse the phone number and ensure it's in the correct format
        const target = args[0].includes("@") ? args[0] : `${args[0]}@s.whatsapp.net`;

        // Add the user to the group
        await robin.groupParticipantsUpdate(from, [target], "add");

        // Confirm success
        return reply(`✅ Successfully added: @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Add Error:", e);
        reply(`❌ Failed to add the user. Error: ${e.message}`);
    }
});

// 8. leave admin
cmd({
    pattern: "demote",
    react: "👎",
    desc: "Remove admin privileges from a mentioned user.",
    category: "group",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, quoted }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user issuing the command is an admin
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Ensure a user is mentioned
        if (!quoted) return reply("⚠️ Please reply to the user's message you want to remove admin privileges from!");

        // Get the target user to demote
        const target = quoted.sender;

        // Ensure the target is not the user who issued the command
        if (target === from) return reply("⚠️ You cannot remove your own admin privileges!");

        // Ensure the target is an admin
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);

        if (!groupAdmins.includes(target)) {
            return reply("⚠️ The mentioned user is not an admin!");
        }

        // Demote the target user
        await robin.groupParticipantsUpdate(from, [target], "demote");

        // Confirm the action
        return reply(`✅ Successfully removed admin privileges from: @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Dismiss Admin Error:", e);
        reply(`❌ Failed to remove admin privileges. Error: ${e.message}`);
    }
});

// 9. give admin
cmd({
    pattern: "promote",
    alias: ["admin", "makeadmin"],
    react: "⚡",
    desc: "Grant admin privileges to a mentioned user.",
    category: "group",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, quoted }) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");

        // Check if the user issuing the command is an admin
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");

        // Ensure a user is mentioned
        if (!quoted) return reply("⚠️ Please reply to the user's message you want to promote to admin!");

        // Get the target user to promote
        const target = quoted.sender;

        // Ensure the target is not already an admin
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);

        if (groupAdmins.includes(target)) {
            return reply("⚠️ The mentioned user is already an admin!");
        }

        // Promote the target user to admin
        await robin.groupParticipantsUpdate(from, [target], "promote");

        // Confirm the action
        return reply(`✅ Successfully promoted @${target.split('@')[0]} to admin!`);
    } catch (e) {
        console.error("Promote Admin Error:", e);
        reply(`❌ Failed to promote the user. Error: ${e.message}`);
    }
});

//  10. Shutdown Bot
cmd({
    pattern: "shutdown",
    alias: ["botoff"],
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply("🛑 Shutting down...").then(() => process.exit());
});
// 2. Broadcast Message to All Groups
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (args.length === 0) return reply("📢 Please provide a message to broadcast.");
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
    }
    reply("📢 Message broadcasted to all groups.");
});

// 11. Set Profile Picture
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");
    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });
        reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});

// 12. Clear All Chats
cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        reply("🧹 All chats cleared successfully!");
    } catch (error) {
        reply(`❌ Error clearing chats: ${error.message}`);
    }
});

// 13. bot jid
cmd({
    pattern: "jid",
    desc: "Get the bot's JID.",
    category: "owner",
    react: "🆔",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply(`🤖 *Bot JID:* ${conn.user.jid}`);
    reply(`${conn.user.jid}`);

});
// 14. Group JIDs List
cmd({
    pattern: "gjid",
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "owner",
    react: "🚩",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Group JIDs:*\n\n${groupJids}`);
});
