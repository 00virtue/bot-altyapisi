const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'end',
    description: 'End a giveaway early by message ID',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageMessages'))
            return message.reply("You need the **Manage Messages** permission.");

        const messageId = args[0];
        if (!messageId) return message.reply("Usage: `,end <messageId>`");

        try {
            let giveawayMessage;

            // Sunucudaki tüm metin kanallarını tarıyoruz
            for (const channel of message.guild.channels.cache.values()) {
                if (channel.isTextBased()) {
                    try {
                        giveawayMessage = await channel.messages.fetch(messageId);
                        if (giveawayMessage) break; // bulunduysa dur
                    } catch {}
                }
            }

            if (!giveawayMessage) return message.reply("Could not find that message.");

            // Collector varsa durdur
            if (message.client.giveawayCollectors && message.client.giveawayCollectors.has(giveawayMessage.id)) {
                message.client.giveawayCollectors.get(giveawayMessage.id).stop();
                message.client.giveawayCollectors.delete(giveawayMessage.id);
            }

            // Embed'i güncelle
            const embed = EmbedBuilder.from(giveawayMessage.embeds[0])
                .setTitle(`${giveawayMessage.embeds[0].title} - Giveaway Ended!`)
                .setColor('#00FF00');

            await giveawayMessage.edit({ embeds: [embed], components: [] });

            message.channel.send(`🎉 Giveaway ${messageId} has been ended early!`);

        } catch (err) {
            console.log(err);
            message.reply("An error occurred while trying to end the giveaway.");
        }
    }
}
