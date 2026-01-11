const mineflayer = require('mineflayer');
const http = require('http');

// 1. WEB SERVER (Prevents Render from shutting down)
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Spectator Bot is Active');
}).listen(process.env.PORT || 3000);

// 2. BOT CONFIGURATION
const botArgs = {
    host: '57.128.115.134', 
    port: 27811,                  
    username: 'Spectator',
    password: 'spectator123', // This is what it will use to /register
    version: '1.20.1'         // Force 1.20.1 for stability
};

function createBot() {
    console.log(`[${new Date().toLocaleTimeString()}] Connecting to server...`);
    const bot = mineflayer.createBot(botArgs);

    // 3. AUTHENTICATION (Register & Login)
    bot.on('messagestr', (message) => {
        const msg = message.toLowerCase();
        
        if (msg.includes('/register')) {
            console.log('Sending /register command...');
            setTimeout(() => bot.chat(`/register ${botArgs.password} ${botArgs.password}`), 3000);
        } else if (msg.includes('/login')) {
            console.log('Sending /login command...');
            setTimeout(() => bot.chat(`/login ${botArgs.password}`), 3000);
        }
    });

    // 4. STAY ACTIVE LOGIC
    bot.on('spawn', () => {
        console.log('✔ Bot is now spawned in the world!');
        
        // Start the RTP loop every 5-7 minutes
        if (!bot.rtpInterval) {
            bot.rtpInterval = setInterval(() => {
                console.log('Performing /rtp to stay active...');
                bot.chat('/rtp');
            }, (5 * 60000) + (Math.random() * 2 * 60000));
        }
    });

    // 5. ERROR HANDLING & AUTO-RESTART
    bot.on('error', (err) => console.log('❌ Connection Error:', err.message));
    
    bot.on('kicked', (reason) => {
        const kickReason = JSON.stringify(reason);
        console.log('❌ Kicked from server:', kickReason);
    });

    bot.on('end', () => {
        console.log('✘ Disconnected. Reconnecting in 30 seconds...');
        if (bot.rtpInterval) clearInterval(bot.rtpInterval);
        setTimeout(createBot, 30000); 
    });
}

createBot();
