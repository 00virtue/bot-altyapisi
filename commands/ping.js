module.exports = {
    name: 'ping',
    description: 'Botun pingini gösterir',
    execute(message, args) {
        message.channel.send(`Pong! ${Date.now() - message.createdTimestamp}ms`);
    },
};
