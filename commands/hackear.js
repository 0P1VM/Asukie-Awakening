const { EmbedBuilder } = require('discord.js');
const c = require('../config.json');

exports.run = async (client, message, args) => {
  message.delete().catch(() => {});

  const membro = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!membro) return message.channel.send(`<a:errado:753245066965024871> **|** Mencione um usuário e um motivo válido!`);
  if (membro === message.member) return message.channel.send(`<a:errado:753245066965024871> **|** Você não pode hackear você mesmo!`);
  if (!message.guild.members.me.permissions.has("EmbedLinks"))
    return message.channel.send(`<a:errado:753245066965024871> **|** Eu não tenho a permissão de **EMBED_LINKS**!`);

  const exemplos = [
    "Quem é aquele admin gostoso? Arruma o zap dele pra mim ai",
    "Não vai dar... Precisamos terminar...",
    "Vamo GF? rs",
    "Queria uma lolizinha :(",
    "Vai com calma que é minha primeira vez tá?",
    "Traveco é mó gostoso",
    "Tudo bem, mas agora eu sou lésbica",
    "Você tá muito linda hoje",
    "Vontade de uébi namorar com você",
    "O cara me gravou gemendo, que doente!",
    "Te amo..."
  ];
  const conexao = [
    "São Paulo", "Bahia", "Amazonas", "Rio de Janeiro", "Russia",
    "Lisboa", "Brasília", "Salvador", "Pará", "Pernambuco",
    "Minas Gerais", "Rio Grande do Sul", "Paraíba"
  ];
  const resultado = Math.floor(Math.random() * exemplos.length);
  const resultado1 = Math.floor(Math.random() * conexao.length);

  const espere = new EmbedBuilder()
    .setDescription(`<a:hackerman:761838986976034827> Entrando em conexão com o servidor... \`(1/2)\``)
    .setImage('https://www.imperva.com/blog/wp-content/uploads/sites/9/2016/12/ddos-spoffed-ips.gif')
    .setColor('#8500de');

  const espere1 = new EmbedBuilder()
    .setDescription(`<a:hackerman:761838986976034827> Invadindo o sistema... \`(2/2)\``)
    .setImage('https://cdn.lowgif.com/small/1c35984a3b1d962a-hacking-gif-tumblr.gif')
    .setColor('#8500de');

  const embed = new EmbedBuilder()
    .setAuthor({ name: `Anonymous Hacking`, iconURL: 'https://media.discordapp.net/attachments/670860111958376470/726250391380951040/9879_hackerman.gif' })
    .setColor('#8500de')
    .addFields(
      { name: `Última Mensagem:`, value: `\`${exemplos[resultado]}\``, inline: true },
      { name: `Última Conexão com o Discord:`, value: `\`${conexao[resultado1]}\``, inline: true },
      { name: `Usuário:`, value: `\`${membro.user.username}\`` },
      { name: `ID:`, value: `\`${membro.id}\``, inline: true }
    )
    .setFooter({ text: `Requisitado: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setThumbnail('https://i.gifer.com/DiXw.gif');

  message.channel.send({ embeds: [espere] }).then((msg) => {
    setTimeout(() => {
      msg.edit({ embeds: [espere1] }).then(() => {
        setTimeout(() => {
          msg.delete().catch(() => {});
          message.channel.send({ embeds: [embed] });
        }, 1000);
      });
    }, 1000);
  });
};

exports.help = {
  name: 'hackerman',
  aliases: ['hackeando', 'hackeador']
};