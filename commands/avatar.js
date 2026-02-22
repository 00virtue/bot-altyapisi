const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Displays the avatar of the mentioned user or yourself.',
    execute(message, args) {
        const user = message.mentions.users.first() || message.author; // Mentioned user or message author
        const embed = new EmbedBuilder()
            .setColor('#0f2754')
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 })) // High resolution, GIF supported
            .setFooter({ text: `Requested by ${message.author.username}`,})
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};