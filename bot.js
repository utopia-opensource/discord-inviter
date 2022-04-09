// before the first run it is necessary to install the discord.js library: npm install discord.js
// to start: node bot
// or: npm start

const DS_TOKEN = `your token`; // bot token
const AUTH_ROLE_ID = `role id`; // role ID auth. users
const GUILD_ID = `server id`; // descord server ID

const MSG_ON_ENTRY = `Good afternoon! For authorization, send me your Utopia public key. If you don't have an account yet, install Utopia: https://u.is/en/download.html`;
const MSG_ALREADY_AUTH = `You are already authorized! Thank you`;
const MSG_ERROR_NOT_IN_GUILD = `You don't seem to be on the server. Go back to the server and send me your key again.!`;
const MSG_ERROR_INVALID_CODE = `I can't make this key out. Is it entered correctly?`;
const MSG_AUTH_SUCCESS = `You are successfully logged in! Now the server is unlocked for you`;

const isHex = /[0-9A-Fa-f]{64}/g;

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS], partials: ['MESSAGE', 'CHANNEL'] });

client.on('ready', () => {
    console.log('Succesfully started...');
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.channel.type != 'DM') return;

    handleKey(msg);
});

client.on('guildMemberAdd', event => {
    event.user.send(MSG_ON_ENTRY)
        .catch(console.error)
});

async function handleKey(msg) {
    let user_id = msg.author.id;
    let members = Object.fromEntries(await Object.fromEntries(client.guilds.cache)[GUILD_ID].members.fetch());

    if (!members.hasOwnProperty(user_id)) {
        return msg.reply(MSG_ERROR_NOT_IN_GUILD);
    }

    if (members[user_id]._roles.includes(AUTH_ROLE_ID)) {
        return msg.reply(MSG_ALREADY_AUTH);
    }

    let code = msg.content;

    if ((code.length == 64) && (code.match(isHex)?.length > 0)) {
        await addAuthRole(members[user_id]);
        return msg.reply(MSG_AUTH_SUCCESS);
    } else {
        return msg.reply(MSG_ERROR_INVALID_CODE);
    }
    
}

async function addAuthRole(member) {
    member.roles.add(AUTH_ROLE_ID);
}

client.login(DS_TOKEN)