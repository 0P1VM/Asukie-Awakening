const weather = require('weather-js');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports.run = (client, message, args) => {
  if (!args.length) {
    const erroEmbed = new EmbedBuilder()
      .setTitle(`📡 INFORMAÇÃO`)
      .setDescription(`*Veja o clima em alguma cidade*`)
      .addFields(
        { name: `🔧 | Uso`, value: `\`${config.prefix}clima <cidade>\``, inline: true },
        { name: `📘 | Exemplo`, value: `\`${config.prefix}clima Rio de Janeiro\``, inline: true },
        { name: `🪪 | Permissão`, value: `\`Nenhuma\`` },
        { name: `🔁 | Alternativas`, value: `\`${config.prefix}tempo\`` }
      )
      .setColor('#8500de')
      .setFooter({ text: `Requisitado: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    return message.channel.send({ embeds: [erroEmbed] });
  }

  weather.find({ search: args.join(" "), degreeType: 'C' }, (err, result) => {
    if (err) {
      console.error(err);
      return message.channel.send("❌ Erro ao buscar dados meteorológicos.");
    }

    if (!result || !result[0]) {
      return message.channel.send(`<a:errado:753245066965024871> **|** Desculpe **${message.author.username}**, não encontrei essa cidade!`);
    }

    const weatherData = result[0];
    const embed = new EmbedBuilder()
      .setTitle(`🌤️ Clima em **${weatherData.location.name}**`)
      .addFields(
        { name: `🌡️ Temperatura`, value: `\`${weatherData.current.temperature}°C\``, inline: true },
        { name: `🥵 Sensação`, value: `\`${weatherData.current.feelslike}°C\``, inline: true },
        { name: `💧 Umidade`, value: `\`${weatherData.current.humidity}%\``, inline: true },
        { name: `💨 Vento`, value: `\`${weatherData.current.windspeed}\``, inline: true }
      )
      .setColor("#8500de")
      .setThumbnail('http://www.pngmart.com/files/3/Weather-PNG-HD.png')
      .setFooter({ text: `Requisitado: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    message.channel.send({ embeds: [embed] });
  });
};

module.exports.help = {
  name: 'clima',
  aliases: ['tempo']
};