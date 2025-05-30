const Discord = require("discord.js"); 

exports.run = async (client, message, args) => {
message.delete();
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  

  let embed = new Discord.MessageEmbed() 
    .setColor('#8500de')
    .setAuthor(`Asukie™`, 'https://cdn.discordapp.com/emojis/760949427648725022.gif?v=1')
	.setDescription(`**Avatar de ${user.username}**`)
    .setImage(user.displayAvatarURL({size: 1024, dynamic: true})) 
    .setFooter(`Requisitado: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}));
 await message.channel.send(embed);

};