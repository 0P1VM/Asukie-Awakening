const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.guild || message.author.bot) return;

  await message.delete().catch(() => {});
  const user = message.mentions.users.first() ||
               client.users.cache.get(args[0]) ||
               message.author;

  const embed = new EmbedBuilder()
    .setColor('#8500de')
    .setAuthor({ name: `Asukie™`, iconURL: 'https://cdn.discordapp.com/emojis/760949427648725022.gif?v=1' })
    .setDescription(`**Avatar de ${user.username}**`)
    .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
    .setFooter({ text: `Requisitado: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  return message.channel.send({ embeds: [embed] });
};