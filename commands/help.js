const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows all available commands categorized.',
    execute: async (message) => {
        const embed = new EmbedBuilder()
            .setColor('#c9f3fa')
            .setTitle('Commands')
            .setDescription('Here are all the available commands categorized by their usage. **Prefix:** `,`')
            .addFields(
                {
                    name: '🛠️・Moderation',
                    value:
                        '`,giverole` — Give a role to a user.\n' +
                        '`,removerole` — Remove a role from a user.\n' +
                        '`,ban` — Ban a member from the server.\n' +
                        '`,unban` — Unban a member from the server\n' +
                        '`,kick` — Kick a member from the server\n' +
                        '`,lock` — Lock the current channel for everyone.\n' +
                        '`,unlock` — Unlock the current channel for everyone.\n' +
                        '`,mute` — Mute the user.\n' +
                        '`,unmute` — Unmute the user.\n' +
                        '`,delete` — Delete messages from the channel.',
                    inline: false,
                },
                {
                    name: '⚙️・Utility',
                    value:
                        '`,help` — Shows this help menu.\n' +
                        '`,userinfo` — Shows info about a user.\n' +
                        '`,serverinfo` — Shows info about the server.',
                    inline: false,
                },
                {
                    name: '🎉・Giveaway',
                    value:
                        '`,giveaway <time in seconds> <winner count> <prize>` — Starts a giveaway.\n' +
                        '`,end <messageId>` — Ends an active giveaway early.\n' +
                        '`,reroll <messageId>` — Rerolls the winners of a finished giveaway.',
                    inline: false,
                },
                {
                    name: '🎮・Fun',
                    value:
                        '`,avatar` — Shows a user\'s avatar.\n' +
                        '`,roll` — Roll a random number between 1-100.\n' +
                        '`,coinflip` — Flip a coin (Heads or Tails).\n' +
                        '`,meme` — Sends a random meme.\n' +
                        '`,say` — Make the bot repeat your message.',
                    inline: false,
                }
            );

        message.channel.send({ embeds: [embed] });
    },
};
