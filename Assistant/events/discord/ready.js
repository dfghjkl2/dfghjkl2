const register = require('../../utils/slashsync');
module.exports = async (client) => {
  /* await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: 'CHAT_INPUT'
  })), {
    debug: true
  });*/
  // Register slash commands - ( If you are one of those people who read the codes I highly suggest ignoring this because I am very bad at what I am doing, thanks LMAO )
  console.log(`[ / | Slash Command ] - ✅ Loaded all slash commands!`)
  let invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
  const activities = [`All Commands Running Smoothly`];
  setInterval(async () => {
    if (client.guildsettings["serverstats_vc"]) {
      if (client.guildsettings["serverstats_vc"]["time_vc_id"]) {
        let ctime = new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Europe/London' })
        await client.channels.cache.get(client.guildsettings["serverstats_vc"]["time_vc_id"]).edit({ name: `🕔 ServerTime : ${ctime}` })
      }
    }
    if (client.guildsettings["serverstats_vc"]) {
      if (client.guildsettings["serverstats_vc"]["humans_vc_id"]) {
        let ch = client.channels.cache.get(client.guildsettings["serverstats_vc"]["humans_vc_id"])
        await ch.guild.members.fetch()
        await ch.edit({ name: `👥 Members : ${ch.guild.memberCount - ch.guild.members.cache.filter(member => member.user.bot).size}` })
      }
    }
    if (client.guildsettings["serverstats_vc"]) {
      if (client.guildsettings["serverstats_vc"]["bots_vc_id"]) {
        let ch1 = client.channels.cache.get(client.guildsettings["serverstats_vc"]["bots_vc_id"])
        await ch1.guild.members.fetch()
        await ch1.edit({ name: `🤖 Bots : ${ch1.guild.members.cache.filter(member => member.user.bot).size}` })
      }
    }
    if (client.guildsettings["serverstats_vc"]) {
      if (client.guildsettings["serverstats_vc"]["total_vc_id"]) {
        let ch2 = client.channels.cache.get(client.guildsettings["serverstats_vc"]["total_vc_id"])
        await ch2.edit({ name: `🌍 Total : ${ch2.guild.memberCount}` })
      }
    }
  }, 900000)
  
  setInterval(() => {
    let activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity, { type: "WATCHING" });
  }, 20000);
};
