const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary').v2;
const Chat = require('./models/Chat'); 

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception');
    process.exit(1);
});

// Config
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

// Connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
    });

    socket.on('sendMessage', async (message) => {
        const { chatId, text, sender } = message;
        
        const chat = await Chat.findById(chatId);
        if (!chat) {
            console.error('Chat not found');
            return;
        }

        const newMessage = { sender, text };
        chat.messages.push(newMessage);
        await chat.save();

        const populatedChat = await Chat.findById(chatId)
            .populate({
                path: 'messages.sender',
                select: 'name avatar'
            })
            .exec();

        const messageWithSender = populatedChat.messages[populatedChat.messages.length - 1];
        if (!messageWithSender) {
            console.error('Message not found');
            return;
        }

        const { _id, ...messageWithoutId } = messageWithSender.toObject();

        // Emit the new message to all clients in the chat room
        io.to(chatId).emit('newMessage', messageWithoutId);
    });

    socket.on('disconnect', () => {
    });
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');

    server.close(() => {
        process.exit(1);
    });
});
