const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    aliases: ['k'],
    description: 'Kick a member from the server and log the action to a designated log channel.',
    execute: async (message, args) => {
        // Yetki kontrolü
        if (!message.member.permissions.has('KickMembers')) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Permission Denied ❌')
                .setDescription("You need the **Kick Members** permission to use this command.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Incorrect Usage ❌')
                .setDescription("Usage: `,kick @member <reason>` or `,kick <memberID> <reason>`")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        const reason = args.slice(1).join(' ') || 'No reason provided.';

        let member;
        try {
            member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        } catch (err) {
            member = null;
        }

        if (!member) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Member Not Found')
                .setDescription("Could not find that member. Make sure you provided a valid ID or mention.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        if (!member.kickable) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Cannot Kick Member')
                .setDescription("I can't kick this member. Make sure my role is higher than theirs and I have the permission.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        try {
            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅・Member Kicked')
                .setDescription(`${member} has been kicked.\n**Reason:** ${reason}`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });

            const logChannel = message.guild.channels.cache.get('ID'); // log kanal ID
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#FF9900')
                    .setTitle('📝・Kick Log')
                    .addFields(
                        { name: 'Kicked Member', value: `${member.user.tag} (${member.id})` },
                        { name: 'Kicked By', value: `${message.author.tag}` },
                        { name: 'Reason', value: reason }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }

        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Kick Member')
                .setDescription("An error occurred while trying to kick this member.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }
    },
};
