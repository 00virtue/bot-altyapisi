const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'giveaway',
    description: 'Start a giveaway with a button.',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply("You need the **Manage Messages** permission to start a giveaway.");
        }

        const time = parseInt(args[0]) * 1000; // saniye cinsinden
        const winnerCount = parseInt(args[1]); // kaç kazanan
        const prize = args.slice(2).join(' '); // ödül
        if (!time || !winnerCount || !prize) return message.reply("Usage: `,giveaway <time in seconds> <winner count> <prize>`");

        const participants = new Set();

        // Başlangıç embed’i
        const embed = new EmbedBuilder()
            .setTitle(prize)
            .setDescription(`Ends: <t:${Math.floor((Date.now() + time)/1000)}:R>\nHosted by: ${message.author}\nEntries: ${participants.size}\nWinners: ${winnerCount}`)
            .setColor('#ffe3b0')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('enter_giveaway')
                    .setLabel('🎉 Enter')
                    .setStyle(ButtonStyle.Primary)
            );

        const giveawayMessage = await message.channel.send({ embeds: [embed], components: [row] });

        // Collector oluştur
        const collector = giveawayMessage.createMessageComponentCollector({ time: time });

        // Collector ve participants Mapleri client üzerinde saklanıyor
        if (!message.client.giveawayCollectors) message.client.giveawayCollectors = new Map();
        message.client.giveawayCollectors.set(giveawayMessage.id, collector);

        if (!message.client.giveawayParticipants) message.client.giveawayParticipants = new Map();
        message.client.giveawayParticipants.set(giveawayMessage.id, participants);

        collector.on('collect', async i => {
            if (i.customId === 'enter_giveaway') {
                if (!participants.has(i.user.id)) {
                    participants.add(i.user.id);
                    await i.reply({ content: `You entered the giveaway! 🎉`, ephemeral: true });

                    // Embed güncelle
                    const updatedEmbed = EmbedBuilder.from(embed)
                        .setDescription(`Ends: <t:${Math.floor((Date.now() + time)/1000)}:R>\nHosted by: ${message.author}\nEntries: ${participants.size}\nWinners: ${winnerCount}`);
                    giveawayMessage.edit({ embeds: [updatedEmbed] });
                } else {
                    i.reply({ content: `You already entered!`, ephemeral: true });
                }
            }
        });

        collector.on('end', async () => {
            const users = Array.from(participants);
            let winners = [];

            if (users.length) {
                while (winners.length < Math.min(winnerCount, users.length)) {
                    const randUser = users[Math.floor(Math.random() * users.length)];
                    if (!winners.includes(randUser)) winners.push(randUser);
                }
            }

            const winnerMentions = await Promise.all(
                winners.map(async id => {
                    const member = await message.guild.members.fetch(id);
                    return member;
                })
            );

            const endEmbed = EmbedBuilder.from(embed)
                .setTitle(`${prize} - Giveaway Ended!`)
                .setDescription(`Winner(s): ${winnerMentions.length ? winnerMentions.join(', ') : 'No participants'}\nHosted by: ${message.author}\nTotal Entries: ${participants.size}`)
                .setColor('#00FF00');

            await giveawayMessage.edit({ embeds: [endEmbed], components: [] });

            if (winnerMentions.length) {
                message.channel.send(`🎉 Congratulations ${winnerMentions.join(', ')}! You won **${prize}** 🎉`);
            }

            // Collector'ı Map'ten kaldır
            if (message.client.giveawayCollectors && message.client.giveawayCollectors.has(giveawayMessage.id)) {
                message.client.giveawayCollectors.delete(giveawayMessage.id);
            }
        });
    },
};
