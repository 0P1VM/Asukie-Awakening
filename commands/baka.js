const Discord = require('discord.js')
const superagent = require("superagent");

exports.run = async (bot, message, args) => {
message.delete();

    let User = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
    if (!User) return message.channel.send("<:erro:753980737484750967> **|** Mencione alguém.");

    const {
        body
    } = await superagent
        .get(`https://nekos.life/api/v2/img/baka`);

    let baka = new Discord.MessageEmbed()
        .setDescription(`${message.author} chamou ${User} de baka!! <:baka:761839480453070879>`)
        .setImage(body.url)
        .setColor("#8500de")
        .setFooter(`Requisitado: ${message.author.username}`, message.author.displayAvatarURL({dynamic: true}))

    message.channel.send(baka)


 }

exports.help = {
    name: "baka",
    aliases: ['bakaa']
}