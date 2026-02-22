module.exports = {
    name: 'roll',
    description: 'Roll a random number between 1-100',
    execute: async (message) => {
        const random = Math.floor(Math.random() * 100) + 1;
        message.channel.send(`🎲 ${message.author} rolled **${random}**!`);
    },
};
