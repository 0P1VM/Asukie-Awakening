const { EmbedBuilder } = require('discord.js');
const num_conv = require('number-to-words');
const c = require('../config.json');

module.exports.run = async (client, message, args) => {
    const erro = new EmbedBuilder()
        .setTitle('INFORMAÇÃO')
        .setDescription('*Crie um texto com letras grandes*')
        .addFields(
            { name: ':hammer: **|** Uso', value: `\`${c.prefix}bigtext <texto>\``, inline: true },
            { name: ':book: **|** Exemplo', value: `\`${c.prefix}bigtext Asukie\``, inline: true },
            { name: ':bookmark: **|** Permissão', value: '`Nenhuma`' },
            { name: ':twisted_rightwards_arrows: **|** Alternativas', value: `\`${c.prefix}letras\`` }
        )
        .setColor('#8500de')
        .setFooter({ text: `Requisitado: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    const output = args.join(' ');
    if (!output) return message.channel.send({ embeds: [erro] });

    const bigtext_arr = [];
    for (let i = 0; i < output.length; i++) {
        const char = output[i];
        const isnumber = parseInt(char);
        if (!isNaN(isnumber) && isnumber >= 0 && isnumber <= 9) {
            bigtext_arr.push(`:${num_conv.toWords(char)}:`);
        } else {
            if (char !== ' ') {
                if (!char.match(/^[a-zA-Z]+$/)) {
                    bigtext_arr.push(`:question:`);
                } else {
                    bigtext_arr.push(`:regional_indicator_${char.toLowerCase()}:`);
                }
            } else {
                bigtext_arr.push('   ');
            }
        }
    }

    try {
        await message.channel.send({ content: bigtext_arr.join('') });
        return message.delete();
    } catch (e) {
        return message.channel.send({ content: '<a:errado:753245066965024871> | Então... Infelizmente, não consegui criar. Houve algum erro!' });
    }
};

exports.help = {
    name: 'bigtext',
    aliases: ['emojify']
};