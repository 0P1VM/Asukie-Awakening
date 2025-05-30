const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');
const config = require('../config.json');

exports.run = async (client, message, args) => {
  if (!message.guild || message.author.bot) return;
  await message.delete().catch(() => {});

  const noPermEmbed = new EmbedBuilder()
    .setDescription(`<a:Bnao:746212123901820929> | Você não tem permissão para banir este usuário.`)
    .setColor(`#8500de`)
    .setFooter({ text: `Comando requisitado por: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.channel.send({
      content: `<a:Bnao:746212123901820929> | Desculpe, ${message.author}, você precisa da permissão **Banir Membros** para executar este comando.`
    });
  }

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.channel.send({
      content: `<a:Bnao:746212123901820929> | Oops! Eu preciso da permissão **Banir Membros** para executar este comando.`
    });
  }

  const membro = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!membro) {
    return message.channel.send({
      content: `<a:Bnao:746212123901820929> | ${message.author}, utilize o comando:\n> **Exemplo:** ${config.prefix}ban @usuário motivo`
    });
  }

  if (membro.id === message.author.id) {
    return message.channel.send({ embeds: [noPermEmbed] });
  }

  const motivo = args.slice(1).join(" ") || "Motivo não inserido";

  const confirmEmbed = new EmbedBuilder()
    .setAuthor({ name: `Confirme a ação a seguir:` })
    .addFields(
      { name: `🔸 Deseja realmente banir o usuário abaixo?`, value: `ㅤ${membro} (\`${membro.id}\`)` },
      { name: `📄 Motivo inserido:`, value: `ㅤ${motivo}` }
    )
    .setColor(`#8500de`)
    .setFooter({ text: `Comando requisitado por: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('confirm_ban')
      .setLabel('✅ Confirmar')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('cancel_ban')
      .setLabel('❌ Cancelar')
      .setStyle(ButtonStyle.Secondary)
  );

  const confirmMsg = await message.channel.send({ embeds: [confirmEmbed], components: [row] });

  const collector = confirmMsg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 15000,
    max: 1,
    filter: i => i.user.id === message.author.id
  });

  collector.on('collect', async interaction => {
    await interaction.deferUpdate();
    if (interaction.customId === 'cancel_ban') {
      await confirmMsg.delete();
      return;
    }

    const dmEmbed = new EmbedBuilder()
      .setAuthor({ name: `Você foi banido | Asukie™` })
      .setThumbnail(`https://media.discordapp.net/attachments/618150447261417492/626945093923766284/giphy_1.gif?width=453&height=453`)
      .addFields(
        {
          name: `👤 Autor do banimento`,
          value: `Tag: \`${message.author.tag}\`\nID: \`${message.author.id}\``,
          inline: true
        },
        {
          name: `📌 Servidor`,
          value: `\`${message.guild.name}\``,
          inline: true
        },
        {
          name: `📄 Motivo`,
          value: motivo
        }
      )
      .setColor(`#8500de`);

    const publicEmbed = new EmbedBuilder()
      .setTitle(`Sistema de Punições | Asukie™`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: `👤 Usuário Banido`,
          value: `Tag: \`${membro.user.tag}\`\nID: \`${membro.id}\``
        },
        {
          name: `👮 Autor do Banimento`,
          value: `Tag: \`${message.author.tag}\`\nID: \`${message.author.id}\``
        },
        {
          name: `📄 Motivo`,
          value: motivo
        }
      )
      .setColor(`#8500de`);

    try {
      await membro.send({ embeds: [dmEmbed] }).catch(() => {});
      await membro.ban({ reason: motivo });
      await message.channel.send({ embeds: [publicEmbed] });
    } catch (err) {
      await message.channel.send(`❌ Erro ao tentar banir o usuário: ${err.message}`);
    } finally {
      await confirmMsg.delete();
    }
  });

  collector.on('end', collected => {
    if (collected.size === 0) confirmMsg.delete().catch(() => {});
  });
};