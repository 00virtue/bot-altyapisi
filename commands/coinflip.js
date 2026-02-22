module.exports = {
    name: 'coinflip',
    description: 'Flip a coin (Heads or Tails)',
    execute: async (message) => {
        const result = Math.random() < 0.5 ? 'Heads 🪙' : 'Tails 🪙';
        message.channel.send(`🪙 ${message.author} flipped a coin: **${result}**!`);
    },
};
