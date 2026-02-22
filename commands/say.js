const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Repeats your message as an embed',
    execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a message to send in an embed!');
        }

        const sayMessage = args.join(' ');

        const embed = new EmbedBuilder()
            .setColor('#0f2754') // Yellow color, matching the bot
            .setDescription(sayMessage);

        message.channel.send({ embeds: [embed] });
        message.delete().catch(() => {}); // Deletes the user's original message
    },
};
