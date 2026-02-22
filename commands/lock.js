const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'lock',
    aliases: ['lockchannel'],
    description: 'Lock the current channel for everyone.',
    execute: async (message) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Permission Denied ❌')
                .setDescription("You need the **Manage Channels** permission to use this command.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });

            const embed = new EmbedBuilder()
                .setColor('#FF9900')
                .setTitle('🔒・Channel Locked')
                .setDescription(`${message.channel} has been locked for everyone.`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Lock')
                .setDescription("An error occurred while trying to lock this channel.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            message.channel.send({ embeds: [embed] });
        }
    },
};
