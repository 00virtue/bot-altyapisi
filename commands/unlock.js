const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unlock',
    aliases: ['unlockchannel'],
    description: 'Unlock the current channel for everyone.',
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
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🔓・Channel Unlocked')
                .setDescription(`${message.channel} has been unlocked for everyone.`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Unlock')
                .setDescription("An error occurred while trying to unlock this channel.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            message.channel.send({ embeds: [embed] });
        }
    },
};
