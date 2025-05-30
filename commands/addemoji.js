const Discord = require('discord.js')
const c = require('../config.json')

exports.run = async (bot, message, args) => {

  if(!message.guild.me.hasPermission('MANAGE_EMOJIS')) return message.channel.send('<a:Bnao:746212123901820929> **|** Oops! eu não tenho a permissão de **MANAGE_EMOJIS**, portanto não posso executar esta ação!')

  if(!args[0]) return message.channel.send(`<a:Bnao:746212123901820929> | ${message.author} utilize o comando.\n` +
	`> **Exemplo:** ${c.prefix}addemoji <nome> <url>`)
  if(!args[1]) return message.channel.send(`<a:Bnao:746212123901820929> | ${message.author} utilize o comando.\n` +
	`> **Exemplo:** ${c.prefix}addemoji <nome> <url>`)

  if(!message.member.hasPermission('MANAGE_EMOJIS')) return message.channel.send(`<a:Bnao:746212123901820929> | Desculpe, ${message.author}. É necessário ter a permissão de **MANAGE_EMOJIS** para executar este comando!`)

  try {
    message.guild.emojis.create(args[1], args[0]).then(emoji => {
      message.channel.send(`${emoji} **|** ${message.author} Emoji adicionado com sucesso!`)
    })
  } catch (err) {
    let a5 = new Discord.MessageEmbed()
    .setDescription(`<:incorreto:729451886683619438> **|** Ocorreu um erro! \`\`\`js\n${err}\`\`\``)

    message.channel.send(a5)
  }

}

exports.help = {
  name: 'addemoji',
  aliases: []
}