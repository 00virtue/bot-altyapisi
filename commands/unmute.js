const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmute a member.',
    execute: async (message, args) => {

        const allowedRoleID = 'ID'; // <- Bu komutu kullanabilecek rolün ID'si
        
        if (!message.member.roles.cache.has(allowedRoleID)) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Permission Denied ❌')
                    .setDescription("You don't have the required role to use this command.")
            ]});
        }

        if (!args[0]) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Incorrect Usage ❌')
                    .setDescription("Usage: `,unmute @member`")
            ]});
        }

        const muteRoleID = '1375828600258826321'; // <- Muted rolünün ID'si
        const muteRole = message.guild.roles.cache.get(muteRoleID);

        if (!muteRole) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌・Mute Role Missing')
                    .setDescription("The mute role does not exist. Please create it first.")
            ]});
        }

        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!member) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌・Member Not Found')
                    .setDescription("Could not find that member.")
            ]});
        }

        if (!member.roles.cache.has(muteRoleID)) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌・Member Not Muted')
                    .setDescription("This member is not muted.")
            ]});
        }

        try {
            await member.roles.remove(muteRole, 'Unmuted by staff');

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅・Member Unmuted')
                .setDescription(`${member} has been unmuted.`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            message.channel.send({ embeds: [embed] });

            // Log kanalı
            const logChannel = message.guild.channels.cache.get('ID'); // <- Buraya log kanal ID'si
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#FF9900')
                    .setTitle('📝・Unmute Log')
                    .addFields(
                        { name: 'Unmuted Member', value: `${member.user.tag} (${member.id})` },
                        { name: 'Unmuted By', value: `${message.author.tag}` }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }

        } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Unmute Member')
                .setDescription("An error occurred while trying to unmute this member.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            message.channel.send({ embeds: [embed] });
        }
    },
};