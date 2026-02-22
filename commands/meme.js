const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'meme',
    description: 'Sends a random meme using Imgflip API',
    execute: async (message) => {
        try {
            // Imgflip API'den popüler memeleri alıyoruz
            const res = await fetch('https://api.imgflip.com/get_memes');
            const data = await res.json();

            if (!data.success) return message.channel.send('Failed to fetch memes!');

            // Rastgele bir meme seç
            const memes = data.data.memes;
            const randomMeme = memes[Math.floor(Math.random() * memes.length)];

            // Embed oluştur
            const embed = new EmbedBuilder()
                .setTitle(randomMeme.name)
                .setImage(randomMeme.url)
                .setColor('#0f2754')
                .setFooter({ text: `Width: ${randomMeme.width} Height: ${randomMeme.height}` });

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.channel.send('An error occurred while fetching a meme.');
        }
    },
};
