const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute a member temporarily.',
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
                    .setDescription("Usage: `,mute @member <duration> <reason>`\nExample: `,mute @User 5m Spamming`")
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

        const durationArg = args[1];
        if (!durationArg) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌・Duration Missing')
                    .setDescription("Please specify a duration. Example: `5m`, `30m`, `1h`")
            ]});
        }

        const reason = args.slice(2).join(' ') || 'No reason provided.';
        const durationMS = parseDuration(durationArg);
        if (!durationMS) {
            return message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌・Invalid Duration')
                    .setDescription("Duration format is invalid. Use `m` for minutes, `h` for hours. Example: `5m`, `1h`")
            ]});
        }

        try {
            await member.roles.add(muteRole, reason);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅・Member Muted')
                .setDescription(`${member} has been muted for **${durationArg}**.\n**Reason:** ${reason}`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            message.channel.send({ embeds: [embed] });

            // 🔹 Log kanalı
            const logChannel = message.guild.channels.cache.get('ID'); // <- Buraya log kanal ID'si
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#FF9900')
                    .setTitle('📝・Mute Log')
                    .addFields(
                        { name: 'Muted Member', value: `${member.user.tag} (${member.id})` },
                        { name: 'Muted By', value: `${message.author.tag}` },
                        { name: 'Duration', value: durationArg },
                        { name: 'Reason', value: reason }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }

            // 🔹 Süre dolunca rolü kaldır
            setTimeout(async () => {
                if (member.roles.cache.has(muteRoleID)) {
                    await member.roles.remove(muteRole, 'Mute duration expired');
                }
            }, durationMS);

        } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Mute Member')
                .setDescription("An error occurred while trying to mute this member.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            message.channel.send({ embeds: [embed] });
        }
    },
};

function parseDuration(duration) {
    const match = duration.match(/^(\d+)(m|h)$/);
    if (!match) return null;
    const num = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'm') return num * 60 * 1000;
    if (unit === 'h') return num * 60 * 60 * 1000;
    return null;
}