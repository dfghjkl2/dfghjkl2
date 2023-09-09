const Discord = require("discord.js");
const mongoose = require("mongoose");
const client = new Discord.Client({ intents: 7755 });
const fs = require("fs");
const config = require("./config.json");
const guildsettings = require("./guildconfig.json");
client.config = config;
client.guildsettings = guildsettings;
const InviteModel = require("./model/invite")
client.db = require("quick.db");

const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

client.afks = new Discord.Collection()
client.spams = new Discord.Collection()
client.cooldown = new Discord.Collection();

tracker.on('guildMemberAdd', async (member, type, invite) => {

    if(type === 'normal') {
        if ((new Date().getTime() - new Date(member.user.createdAt).getTime()) < 86400000) {
          let data = await InviteModel.findOne({
              guildID: member.guild.id,
              userID: invite.inviter.id
          });
          if (!data) {
            data = new InviteModel({
                servername: member.guild.name,
                userID: invite.inviter.id,
                joiner: [member.id],
                regular: 0,
                left: 0,
                fake: 1,
                guildID: member.guild.id
            })
            await data.save()
          } else {
            if (data.joiner.includes(member.id)) return
            data.joiner.push(member.id)
            data.fake += 1
            await data.save()
          }
        }
        else {
          let data = await InviteModel.findOne({
              guildID: member.guild.id,
              userID: invite.inviter.id
          });
          if (!data) {
            data = new InviteModel({
                servername: member.guild.name,
                userID: invite.inviter.id,
                joiner: [member.id],
                regular: 1,
                left: 0,
                fake: 0,
                guildID: member.guild.id
            })
            await data.save()
          } else {
            if (data.joiner.includes(member.id)) return
            data.joiner.push(member.id)
            data.regular += 1
            await data.save()
          }
        }
    }
});

tracker.on('guildMemberAdd', (member, type, invite) => {
    if (!client.guildsettings[member.guild.id]) return
    if (!client.guildsettings[member.guild.id].welcome_logs) return
    const welcomeChannel = member.guild.channels.cache.get(client.guildsettings[member.guild.id].logs.welcome_logs)

    if(type === 'normal'){
        welcomeChannel.send(`${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"}Welcome ${member.displayName}!\n${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"} You were invited by ${invite.inviter.username}!`);
    }

    else if(type === 'vanity'){
        welcomeChannel.send(`${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"}Welcome ${member.displayName}!\n${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"} You joined using a custom invite!`);
    }

    else if(type === 'permissions'){
        welcomeChannel.send(`${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"}Welcome ${member.displayName}! \n${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"} I can't figure out how you joined because I don't have the "Manage Server" permission!`);
    }

    else if(type === 'unknown'){
        welcomeChannel.send(`${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"}Welcome ${member.displayName}! \n${client.guildsettings[member.guild.id].welcome_emoji ? client.guildsettings[member.guild.id].welcome_emoji : 
"✅"} I can't figure out how you joined the server...`);
    }

});


client.on("guildMemberRemove", async(member) => {
    let data = await InviteModel.find({
        guildID: member.guild.id
    });
    if (!data) return
    let joiners = []
    data.forEach(d => {
      d.joiner.forEach(j => {
        joiners.push(j)
      })
    })
    if (!joiners.includes(member.id)) return
    else {
      let inviter;
      data.forEach(d => {
        d.joiner.forEach(j => {
          if (j === member.id) {
            inviter = d.userID
          }
        })
      })
      data = await InviteModel.findOne({
          guildID: member.guild.id,
          userID: inviter
      });
      data.left += 1;
      data.joiner.pull(member.id)
      await data.save()
    }
})

// Initialise discord giveaways
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./storage/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `🛑 **Last chance to enter** 🛑`,
      threshold: 5000,
      embedColor: '#FF0000'
    }
  }
});

/* Load all events (discord based) */


fs.readdir("./events/discord", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event]   ✅  Loaded: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});

/* Load all events (giveaways based) */


fs.readdir("./events/giveaways", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event]   🎉 Loaded: ${eventName}`);
    client.giveawaysManager.on(eventName, (...file) => event.execute(...file, client)), delete require.cache[require.resolve(`./events/giveaways/${file}`)];
  })
})

// Let commands be a new collection ( message commands )
client.commands = new Discord.Collection();
/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, {
      name: commandName,
      ...props
    });
    console.log(`[Command] ✅  Loaded: ${commandName}`);
  });
});

// let interactions be a new collection ( slash commands  )
client.interactions = new Discord.Collection();
// creating an empty array for registering slash commands
client.register_arr = []
/* Load all slash commands */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props
    });
    client.register_arr.push(props)
  });
});

client.on("guildMemberAdd", async member => {

  

  if (!client.guildsettings[member.guild.id]) return
  if (!client.guildsettings[member.guild.id].welcome) return
  const channel = client.guildsettings[member.guild.id].welcome.channelID
  const text = client.guildsettings[member.guild.id].welcome.message
  const img = client.guildsettings[member.guild.id].welcome.img_url
  const tnail = member.user.displayAvatarURL({ dynamic: true })


if (channel === null) {
    return;
  }
  
const mes = text.replace("{user}", member.user.username).replace("{server}", member.guild.name).replace("{tag}", member.user.tag).replace("{mention}", `<@${member.user.id}>`).replace("{rank}", member.guild.members.cache.size);

  const embed = new Discord.MessageEmbed()
.setTitle(`Welcome to ${member.guild.name}`)
.setDescription(`${mes}`)
.setImage(img)
.setThumbnail(tnail)
.setColor("#56089e")



client.channels.cache.get(channel).send({ content: `<@${member.id}>`, embeds:[embed] })
});

process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
    console.log(type, promise, reason);
});

mongoose.connect(config.mongourl, {
	useNewUrlParser:true,
	useUnifiedTopology:true
})
  .then(console.log('Mongodb is Connected'))

// Login through the client
client.login(config.token);
