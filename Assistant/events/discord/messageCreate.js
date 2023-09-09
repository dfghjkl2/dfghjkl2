const ResponseModel = require("../../model/custom")
const WordModel = require("../../model/banword")
const Urlcheck = require("../../utils/Urlcheck")
const GifCheck = require("../../utils/GifCheck")
const { MessageEmbed } = require("discord.js")

module.exports = async (client, message) => {
  function xp(message) {
    if (!client.cooldown.has(`${message.author.id}`) || !(Date.now() - client.cooldown.get(`${message.author.id}`) > client.config.cooldown)) {
      let xp = client.db.add(`xp_${message.author.id}`, 1);
      let level = Math.floor(0.3 * Math.sqrt(xp));
      let lvl = client.db.get(`level_${message.author.id}`) || client.db.set(`level_${message.author.id}`, 1);;
      if (level > lvl) {
        let newLevel = client.db.set(`level_${message.author.id}`, level);
        message.channel.send(`:tada: ${message.author.toString()}, You just advanced to level ${newLevel}!`);
      }
      client.cooldown.set(`${message.author.id}`, Date.now());
    }
  }
  // return if author is a bot
  if (message.author.bot) return;
  xp(message)
  if (message.mentions.users.size !== 0) {
    let users = [];
    message.mentions.users.forEach(e => {
      users.push(e.id)
    })
    let user;
    users.forEach(u => {
      if (client.afks.get(u)) return user = u
    })
    if (user) {
      message.channel.send(`${message.author}, ${message.mentions.users.first().username} is ${client.afks.get(user)}`);
    }
  }
  const currentGuildSettings = client.guildsettings[message.guild.id]
  if (currentGuildSettings && currentGuildSettings.antilink.enabled) {
    const LINK_DETECTED = Urlcheck(message.content)
    if (LINK_DETECTED && (!message.member.roles.cache.has(currentGuildSettings.antilink.rolesExcluded) && !message.member.permissions.has("ADMINISTRATOR"))) {
      if (currentGuildSettings.antilink.allowgif) {
        const GIF_DETECTED = GifCheck(message.content)
        if (GIF_DETECTED) {
          // message.channel.send(`<@${message.member.id}>, Don\'t Send Links`)
          message.delete().catch(() => { console.log("Error Occured While Deleting Link ") })
          client.spams.set(message.author.id, client.spams.get(message.author.id) === undefined ? 0 : client.spams.get(message.author.id) + 1)
          if (client.spams.get(message.author.id) === (client.guildsettings[message.guild.id].links_spam_time - 1)) {
            message.channel.send(`${message.author}, Don't Spam Links Onemore. I Will Mute You`)
          }
          if (client.spams.get(message.author.id) === client.guildsettings[message.guild.id].links_spam_time && client.guildsettings[message.guild.id]) {
            if (client.guildsettings[message.guild.id].mute_time) {
              message.member.timeout(6 * 60 * 60 * 1000).catch(() => { })
              message.channel.send(`${message.author} Has Been Muted For Spamming Links`)
              client.spams.delete(message.author.id)
            }
          }
        }
      }
      else {
        message.delete().catch(() => { console.log("Error Occured While Deleting Link ") })
        client.spams.set(message.author.id, client.spams.get(message.author.id) === undefined ? 0 : client.spams.get(message.author.id) + 1)
        if (client.spams.get(message.author.id) === (client.guildsettings[message.guild.id].links_spam_time - 1)) {
          message.channel.send(`${message.author}, Don't Spam Links Onemore. I Will Mute You`)
        }
        if (client.spams.get(message.author.id) === client.guildsettings[message.guild.id].links_spam_time && client.guildsettings[message.guild.id]) {
          if (client.guildsettings[message.guild.id].mute_time) {
            message.member.timeout(6 * 60 * 60 * 1000).catch(() => { })
            message.channel.send(`${message.author} Has Been Muted For Spamming Links`)
            client.spams.delete(message.author.id)
          }
        }
      }
    }
  }
  let wdata = await WordModel.findOne({
    guildID: message.guild.id
  });
  if (wdata && !message.content.startsWith(`${client.config.prefix}deletebanword`)) {
    let words = wdata.words
    const lmsg = message.content.toLowerCase()
    let isBanned;
    words.forEach(word => {
      if (isBanned) return
      if (lmsg.includes(word)) return isBanned = true
      return isBanned = false
    })
    if (isBanned) {
      message.delete()
      return message.channel.send(`<@${message.member.id}>The Word is Banned Dont Use It You Dump`)
    }
  }
  const rdata = await ResponseModel.findOne({
    message: message.content
  });
  if (rdata) return message.channel.send({ embeds: [new MessageEmbed().setDescription(rdata.response)] })
  // return if message does not match prefix (in command)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Defining what are arguments and commands
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If command does not exist return
  if (!cmd) return;

  // Run the command
  await cmd.run(client, message, args);
};
