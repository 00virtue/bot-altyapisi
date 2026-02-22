const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removerole',
    description: 'Remove a role from a member with an embed showing who removed it.',
    execute: async (message, args) => {
        // Yetki kontrolü
        if (!message.member.permissions.has('ManageRoles')) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Permission Denied ❌')
                .setDescription("You need the **Manage Roles** permission to use this command.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        // Üye bulma: önce mention, yoksa ID ile
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (!member || !role) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Incorrect Usage ❌')
                .setDescription("Usage: `,removerole @member @role`")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }

        try {
            await member.roles.remove(role);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅・Role Removed')
                .setDescription(`${role} has been removed from ${member} by ${message.author}.`)
                .setTimestamp()
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌・Failed to Remove Role')
                .setDescription("I couldn't remove the role. Make sure my role is **higher** than the role to remove.")
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
            return message.channel.send({ embeds: [embed] });
        }
    },
};
