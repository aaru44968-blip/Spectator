const mineflayer = require('mineflayer');
const http = require('http');

// 1. WEB SERVER (For hosting stability)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot Status: Online');
}).listen(process.env.PORT || 3000);

// 2. BOT CONFIGURATION
const botArgs = {
    host: 'infernomc.progamer.me', 
    username: 'Spectator',
    password: 'spectator123', 
    version: '1.20.1'
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] Connecting to server...`);
    const bot = mineflayer.createBot(botArgs);

    // 3. AUTHENTICATION (Register & Login)
    bot.on('messagestr', (message) => {
        const msg = message.toLowerCase();
        if (msg.includes('/register')) {
            console.log('Detected /register request...');
            setTimeout(() => bot.chat(`/register ${botArgs.password} ${botArgs.password}`), 3000);
        } else if (msg.includes('/login')) {
            console.log('Detected /login request...');
            setTimeout(() => bot.chat(`/login ${botArgs.password}`), 3000);
        }
    });

    // 4. STAY ACTIVE LOGIC
    bot.on('spawn', () => {
        console.log('✔ Bot is now spawned in the world!');
        if (!bot.rtpInterval) {
            bot.rtpInterval = setInterval(() => {
                console.log('Performing /rtp...');
                bot.chat('/rtp');
            }, 300000); // 5 minutes
        }
    });

    // 5. ERROR HANDLING & RECONNECT
    bot.on('error', (err) => console.log('❌ Error:', err.message));
    
    bot.on('kicked', (reason) => console.log('❌ Kicked:', reason));

    bot.on('end', () => {
        console.log('✘ Connection lost. Reconnecting in 30 seconds...');
        if (bot.rtpInterval) clearInterval(bot.rtpInterval);
        setTimeout(createBot, 30000); 
    });
}

createBot();
