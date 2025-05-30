console.log("[DEBUG] Arquivo index.js está sendo executado");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
  ChannelType
} = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const db = require("quick.db");
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember
  ]
});

client.on("ready", () => {
  console.log(`Iniciado em ${client.user.tag}`);

  const tabela = [
    {
      name: `Saiba como me adicionar pelo ${config.prefix}ajuda`,
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/asukie"
    },
    {
      name: `Encontrou falhas? Reporte para o suporte.`,
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/asukie"
    },
    {
      name: `em ${client.guilds.cache.size} servidores 💙`,
      type: ActivityType.Streaming,
      url: "https://www.twitch.tv/asukie"
    }
  ];

  function setStatus() {
    const status = tabela[Math.floor(Math.random() * tabela.length)];
    client.user.setActivity(status);
  }

  setStatus();
  setInterval(setStatus, 10000);

  console.log(`Servidores: ${client.guilds.cache.size}`);
  console.log(`Usuários: ${client.users.cache.size}`);
});

client.on("messageCreate", message => {
  if (
    message.author.bot ||
    message.channel.type === ChannelType.DM
  ) return;

  // Embed se mencionado
  if (
    message.content.includes(`<@!${client.user.id}>`) ||
    message.content.includes(`<@${client.user.id}>`)
  ) {
    const embed = new EmbedBuilder()
      .setTitle(`**❓ | Está perdido(a), ${message.author.username}?**`)
      .setDescription(`**➡️ Eu me chamo ${client.user.username} e sou um bot com várias funções, criado para ajudar o seu servidor! ✨**`)
      .setThumbnail('https://cdn.discordapp.com/emojis/739200876752797697.png?v=1')
      .addFields(
        {
          name: `🔧 **| Meu prefixo:**`,
          value: `\`${config.prefix}\``,
          inline: true
        },
        {
          name: `📘 **| Comando de ajuda:**`,
          value: `\`${config.prefix}help\``,
          inline: true
        }
      )
      .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setColor(`#8500de`)
      .setTimestamp();

    return message.channel.send({ content: `${message.author}`, embeds: [embed] });
  }

  if (!message.content.toLowerCase().startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
    console.log(`[DEBUG] Comando '${command}' executado por ${message.author.tag}`);
  } catch (err) {
    console.error(`Erro ao executar comando '${command}':`, err);
    message.delete().catch(() => {});
  }
  });
  
console.log("[DEBUG] Tentando logar o bot...");
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log("[DEBUG] Login realizado com sucesso"))
  .catch(err => {
    console.error("[ERRO] Falha ao logar:", err.message);
    process.exit(1);
  });