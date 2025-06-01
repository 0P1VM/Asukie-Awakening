console.log("[DEBUG] Arquivo index.js está sendo executado");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
  ChannelType,
  Collection
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

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name || command.run) {
    client.commands.set(file.replace(".js", ""), command);
  }
}

client.slashCommands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) {
    client.slashCommands.set(command.data.name, command);
  }
}

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

// === Slash Command Handler ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
    console.log(`[SLASH] Comando /${interaction.commandName} executado por ${interaction.user.tag}`);
  } catch (err) {
    console.error(`[ERRO] Slash /${interaction.commandName}:`, err);
    await interaction.reply({ content: '❌ Ocorreu um erro ao executar este comando.', ephemeral: true });
  }
});

client.on("messageCreate", message => {
  if (
    message.author.bot ||
    message.channel.type === ChannelType.DM
  ) return;

  if (
    message.content.includes(`<@!${client.user.id}>`) ||
    message.content.includes(`<@${client.user.id}>`)
  ) {
    const embed = new EmbedBuilder()
      .setTitle(`**❓ | Está perdido(a), ${message.author.username}?**`)
      .setDescription(`**➡️ Eu me chamo ${client.user.username} e sou um bot com várias funções! ✨**`)
      .addFields(
        { name: `🔧 Prefixo:`, value: `\`${config.prefix}\``, inline: true },
        { name: `📘 Ajuda:`, value: `\`${config.prefix}help\``, inline: true }
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(`#8500de`)
      .setTimestamp();

    return message.channel.send({ content: `${message.author}`, embeds: [embed] });
  }

  if (!message.content.toLowerCase().startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = client.commands.get(command);
    if (!commandFile) return;
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