const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Etiketlenen kullanıcının bilgilerini gösterir',
    execute(message, args) {
        const user = message.mentions.users.first() || message.author; // Etiket yoksa komutu yazan kişi
        const member = message.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setColor('#0f2754')
            .setAuthor({ name: `${user.tag} (${user.id})`,})
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Bilinmiyor', inline: true },
                { 
  name: 'Roles', 
  value: member 
    ? member.roles.cache
        .sort((a, b) => b.position - a.position) // yüksekten düşüğe sırala
        .map(r => r)
        .join(' ')
        .replace(/@everyone,? ?/, '') || 'No Role' 
    : 'Unknown' 
}

            )
        message.channel.send({ embeds: [embed] });
    },
};
