const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Botun davet linkini gösterir.',
    execute(message, args) {
        const client = message.client;

        const embed = new EmbedBuilder()
            .setColor('#0f2754')
            .setAuthor({ name: client.user.username,})
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
`🌐 [**Invite the Bot**](https://discord.com/oauth2/authorize?client_id=1387856381440164032&permissions=8&integration_type=0&scope=bot)
💬 [**Support Server**](https://discord.gg/VNBVddBB8Q)`
            
            )
        message.channel.send({ embeds: [embed] });
    },
};
