const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unban',
    aliases: ['ub'], // kısa komut için alias
    description: 'Unban a member and log the action to a designated log channel.',
    execute: async (message, args) => {
        // Yetki kontrolü
        if (!message.member.permissions.has('BanMembers')) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Permission Denied ❌')
                .setDescription("You need the **Ban Members** permission to use this command.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        const userId = args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided.';

        if (!userId) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Incorrect Usage ❌')
                .setDescription("Usage: `,unban <userID> <reason>`")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        try {
            // Banlı kullanıcıyı getir
            const bannedUsers = await message.guild.bans.fetch();
            const bannedUser = bannedUsers.get(userId);

            if (!bannedUser) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌・User Not Found')
                    .setDescription("This user is not banned or invalid ID.")
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
                return message.channel.send({ embeds: [embed] });
            }

            await message.guild.bans.remove(userId, reason);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅・Member Unbanned')
                .setDescription(`${bannedUser.user.tag} has been unbanned.\n**Reason:** ${reason}`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });

            // Log kanalı
            const logChannel = message.guild.channels.cache.get('ID'); // log kanal ID'si
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#00CCFF')
                    .setTitle('📝・Unban Log')
                    .addFields(
                        { name: 'Unbanned Member', value: `${bannedUser.user.tag} (${bannedUser.user.id})` },
                        { name: 'Unbanned By', value: `${message.author.tag}` },
                        { name: 'Reason', value: reason }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }

        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Unban Member')
                .setDescription("An error occurred while trying to unban this member.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }
    },
};
