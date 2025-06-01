const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um usuário do servidor.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('usuário').setDescription('Usuário para banir').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo').setDescription('Motivo do banimento').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('usuário');
    const motivo = interaction.options.getString('motivo') || 'Motivo não inserido';
    const author = interaction.user;

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ Eu preciso da permissão **Banir Membros** para executar esse comando.',
        ephemeral: true
      });
    }

    if (!target) {
      return interaction.reply({ content: '❌ Usuário não encontrado.', ephemeral: true });
    }

    if (target.id === author.id || target.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ Ação não permitida.', ephemeral: true });
    }

    const confirmEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Confirme a ação a seguir:' })
      .addFields(
        { name: `🔸 Deseja banir o usuário abaixo?`, value: `${target} (\`${target.id}\`)` },
        { name: `📄 Motivo inserido:`, value: motivo }
      )
      .setColor('#8500de')
      .setFooter({ text: `Comando requisitado por: ${author.tag}`, iconURL: author.displayAvatarURL({ dynamic: true }) });

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

    await interaction.reply({ embeds: [confirmEmbed], components: [row], ephemeral: true });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
      max: 1,
      filter: i => i.user.id === author.id
    });

    collector.on('collect', async i => {
      await i.deferUpdate();

      if (i.customId === 'cancel_ban') {
        return interaction.editReply({
          content: '❌ Banimento cancelado.',
          embeds: [],
          components: []
        });
      }

      const dmEmbed = new EmbedBuilder()
        .setAuthor({ name: `Você foi banido | Asukie™` })
        .setThumbnail('https://media.discordapp.net/attachments/618150447261417492/626945093923766284/giphy_1.gif?width=453&height=453')
        .addFields(
          { name: `👤 Autor`, value: `\`${author.tag}\` (\`${author.id}\`)`, inline: true },
          { name: `📌 Servidor`, value: `\`${interaction.guild.name}\``, inline: true },
          { name: `📄 Motivo`, value: motivo }
        )
        .setColor('#8500de');

      const publicEmbed = new EmbedBuilder()
        .setTitle('Sistema de Punições | Asukie™')
        .setThumbnail(author.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: `👤 Usuário Banido`, value: `\`${target.user.tag}\` (\`${target.id}\`)` },
          { name: `👮 Autor`, value: `\`${author.tag}\` (\`${author.id}\`)` },
          { name: `📄 Motivo`, value: motivo }
        )
        .setColor('#8500de');

      try {
        await target.send({ embeds: [dmEmbed] }).catch(() => {});
        await target.ban({ reason: motivo });
        await interaction.editReply({
          content: '✅ Usuário banido com sucesso!',
          embeds: [publicEmbed],
          components: []
        });
      } catch (err) {
        await interaction.editReply({
          content: `❌ Ocorreu um erro ao tentar banir: ${err.message}`,
          embeds: [],
          components: []
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({
          content: '⏱️ Tempo esgotado. Ação cancelada.',
          embeds: [],
          components: []
        }).catch(() => {});
      }
    });
  }
};