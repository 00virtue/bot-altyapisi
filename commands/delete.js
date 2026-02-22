const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'delete',
    description: 'Delete a number of recent messages with an embed confirmation.',
    execute: async (message, args) => {
        if (!message.member.permissions.has('ManageMessages')) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Permission Denied')
                .setDescription("You need the **Manage Messages** permission to use this command.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        const amount = parseInt(args[0]);
        if (!amount || isNaN(amount) || amount < 1 || amount > 100) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Incorrect Usage')
                .setDescription("Usage: `,delete <number>` (1-100)")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        try {
            // Komutu yazan mesaj dahil olmak istemiyorsan +1 çıkarabiliriz
            const messages = await message.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅・Messages Deleted')
                .setDescription(`Successfully deleted **${messages.size}** messages.`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Delete Messages')
                .setDescription("I couldn't delete the messages. Make sure they are not older than 14 days and I have permission to manage messages.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }
    },
};
