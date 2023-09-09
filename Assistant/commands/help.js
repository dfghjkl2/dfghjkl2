const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

const embed = new MessageEmbed()
.setTitle(`Commands of ${client.user.username}`)
.setColor('#56089e')
.setDescription('**Please Select a category to view all its commands**')
.setTimestamp()
.setFooter({
  text: `Requested by ${message.author.username}`,
  iconURL: message.author.displayAvatarURL()
});

  const giveaway = new MessageEmbed()
  .setTitle("Giveaway")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the giveaway commands:```")
  .addFields(
    { name: 'Create / Start'  , value: `Start a giveaway in your guild`, inline: true },
    { name: 'Edit' , value: `Edit an already running giveaway`, inline: true },
    { name: 'End' , value: `End an already running giveaway`, inline: true },
    { name: 'List' , value: `List all the giveaways running within this guild`, inline: true },
    { name: 'Pause' , value: `Pause an already running giveaway`, inline: true },
    { name: 'Reroll' , value: `Reroll an ended giveaway`, inline: true },
    { name: 'Resume' , value: `Resume a paused giveaway`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });

  const general = new MessageEmbed()
  .setTitle("General")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the general bot commands:```")
  .addFields(
    { name: 'Help'  , value: `Shows all available commands to this bot`, inline: true },
    { name: 'Invite' , value: `Get the bot's invite link`, inline: true },
    { name: 'stats' , value: `Get the server stats`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });
  
  const response = new MessageEmbed()
  .setTitle("Response")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the Custom bot commands:```")
  .addFields(
    { name: 'Addresponse'  , value: `Add A New Custom Command For This Server`, inline: true },
    { name: 'Deleteresponse'  , value: `Remove A Custom Command Of This Server`, inline: true },
    { name: 'Listresponse' , value: `Shows The List Of Custom Commands`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });

  const invites = new MessageEmbed()
  .setTitle("Invite")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the Custom bot commands:```")
  .addFields(
    { name: 'invites'  , value: `View All User Invites`, inline: true },
    { name: 'resetinvites'  , value: `Reset Invite for Every user in this server`, inline: true },
    { name: 'resetinvites <@mention>' , value: `Reset Invite for mentioned user in this server`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });

  const banword = new MessageEmbed()
  .setTitle("Banword")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the Custom bot commands:```")
  .addFields(
    { name: 'Addbanword'  , value: `Add A New Custom Ban Word For This Server`, inline: true },
    { name: 'Deletebanword'  , value: `Remove A Custom Ban Word Of This Server`, inline: true },
    { name: 'Listbanwords' , value: `Shows The List Of Custom Ban Word`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });

  const rank = new MessageEmbed()
  .setTitle("Leveling System")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the Level commands:```")
  .addFields(
    { name: 'level'  , value: `Show Level Of Someone/yourself`, inline: true },
    { name: 'givelevel'  , value: `Add Level To Someone/yourself`, inline: true },
    { name: 'leaderboard'  , value: `Show Level Of Everyone In This Server`, inline: true }
  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });

    const mod = new MessageEmbed()
  .setTitle("Moderation")
  .setColor('#56089e')
  .setDescription("```yaml\nHere are the Custom bot commands:```")
  .addFields(
    { name: 'kick'  , value: `Kick a User`, inline: true },
    { name: 'ban'  , value: `Ban a User`, inline: true },
    { name: 'purge' , value: `purge amount of messgaes`, inline: true },
    { name: 'antilink', value:`to delete promotion links`,inline: true},
    { name: 'autokick',value: `kick user without taking role`,inline: true },
    { name: 'welcome',value: `to welcome new users`},
    { name: 'afk',value: `to set custom afk`}
    


  )
  .setTimestamp()
  .setFooter({
    text: `Requested by ${message.author.username}`, 
    iconURL: message.author.displayAvatarURL()
  });
  
  const components = (state) => [
    new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("help-menu")
        .setPlaceholder("Please Select a Category")
        .setDisabled(state)
        .addOptions([{
                label: `Giveaways`,
                value: `giveaway`,
                description: `View all the giveaway based commands!`,
                emoji: `🎉`
            },
            {
                label: `General`,
                value: `general`,
                description: `View all the general bot commands!`,
                emoji: `⚙`
            },
            {
                label: `Response`,
                value: `response`,
                description: `View all the Custom bot commands!`,
                emoji: `📋`
            },
            {
                label: `Leveling`,
                value: `rank`,
                description: `View all the Leveling commands!`,
                emoji: `📊`
            },
            {
                label: `Invite`,
                value: `invite`,
                description: `View all the Invite bot commands!`,
                emoji: `🎁`
            },
            {
                label: `Banword`,
                value: `banword`,
                description: `View all the Banword bot commands!`,
                emoji: `🎭`
            },
            {
                label: `Moderation`,
                value: `mod`,
                description: `View all the Mod bot commands!`,
                emoji: `👮`
            }
        ])
    ),
];

const initialMessage = await message.reply({ embeds: [embed], components: components(false) });

const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector(
            {
                filter,
                componentType: "SELECT_MENU",
                idle: 300000,
                dispose: true,
            });

        collector.on('collect', (interaction) => {
            if (interaction.values[0] === "giveaway") {
                interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "general") {
                interaction.update({ embeds: [general], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "response") {
                interaction.update({ embeds: [response], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "invite") {
                interaction.update({ embeds: [invites], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "banword") {
                interaction.update({ embeds: [banword], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "mod") {
                interaction.update({ embeds: [mod], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "rank") {
                interaction.update({ embeds: [rank], components: components(false) }).catch((e) => {});
            }
        });
        collector.on("end", (collected, reason) => {
            if (reason == "time") {
                initialMessage.edit({
                   content: "Collector Destroyed, Try Again!",
                   components: [],
                });
             }
        });
}
