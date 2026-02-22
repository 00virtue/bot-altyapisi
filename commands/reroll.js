const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'reroll',
    description: 'Reroll winners of a giveaway',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageMessages'))
            return message.reply("You need the **Manage Messages** permission.");

        const messageId = args[0];
        if (!messageId) return message.reply("Usage: `!reroll <messageId>`");

        try {
            let giveawayMessage;

            // Sunucudaki tüm metin kanallarını tarıyoruz
            for (const channel of message.guild.channels.cache.values()) {
                if (channel.isTextBased()) {
                    try {
                        giveawayMessage = await channel.messages.fetch(messageId);
                        if (giveawayMessage) break;
                    } catch {}
                }
            }

            if (!giveawayMessage) return message.reply("Could not find that message.");

            // Katılımcılar Map veya collector üzerinden alınabilir
            const participants = message.client.giveawayParticipants?.get(giveawayMessage.id);
            if (!participants || participants.size === 0)
                return message.reply("No participants to reroll!");

            // Embed'den winnerCount al
            const winnerCountMatch = giveawayMessage.embeds[0].description.match(/Winners: (\d+)/);
            const winnerCount = winnerCountMatch ? parseInt(winnerCountMatch[1]) : 1;

            const users = Array.from(participants);
            let winners = [];

            while (winners.length < Math.min(winnerCount, users.length)) {
                const randUser = users[Math.floor(Math.random() * users.length)];
                if (!winners.includes(randUser)) winners.push(randUser);
            }

            const winnerMentions = await Promise.all(
                winners.map(async id => {
                    const member = await message.guild.members.fetch(id);
                    return member;
                })
            );

            // Embed güncelle: sadece "Giveaway Rerolled!" başlığı
            const updatedEmbed = new EmbedBuilder()
                .setTitle(`${giveawayMessage.embeds[0].title} - Giveaway Rerolled!`)
                .setDescription(`Winner(s): ${winnerMentions.join(', ')}\nHosted by: ${message.author}`)
                .setColor('#00FF00');

            await giveawayMessage.edit({ embeds: [updatedEmbed] });

            // Temiz mesaj gönder
            message.channel.send({
                content: `🎉 The giveaway has been **rerolled**!\nWinner(s): ${winnerMentions.join(', ')} 🎉`
            });

        } catch (err) {
            console.log(err);
            message.reply("An error occurred while trying to reroll the giveaway.");
        }
    }
};
