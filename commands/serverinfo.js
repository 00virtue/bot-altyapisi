const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Shows a compact server information embed',
    execute(message, args) {
        const { guild } = message;

        const members = guild.members.cache;
        const humans = members.filter(m => !m.user.bot).size;
        const bots = members.filter(m => m.user.bot).size;

        const channels = guild.channels.cache;
        const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
        const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;

        const roles = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r.name)
            .join(', ')
            .replace(/@everyone,? ?/, '');

        const embed = new EmbedBuilder()
            .setColor('#0f2754')
            .setTitle(`${guild.name}`)
            .addFields(
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Members', value: `${guild.memberCount.toLocaleString()}`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Category Channels', value: `${categories}`, inline: true },
                { name: 'Text Channels', value: `${textChannels}`, inline: true },
                { name: 'Voice Channels', value: `${voiceChannels}`, inline: true },
                { name: 'Boost Count', value: `${guild.premiumSubscriptionCount} Boosts (Tier ${guild.premiumTier})`, inline: true },
                { name: 'Visuals', value: `[Icon](${guild.iconURL() || 'N/A'}) | [Banner](${guild.bannerURL() || 'N/A'}) | [Splash](${guild.splashURL() || 'N/A'})`, inline: false },
                { name: 'ID & Created', value: `ID: ${guild.id} | Server Created • <t:${Math.floor(guild.createdTimestamp / 1000)}:f>`, inline: false }
            )

        message.channel.send({ embeds: [embed] });
    },
};
