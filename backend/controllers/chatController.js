const Chat = require('../models/Chat');
const User = require('../models/userModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//creating or finding a chat
exports.createChat = catchAsyncErrors(async (req, res, next) => {
  const { participantId } = req.body;
  const userId = req.user.id;

  let chat = await Chat.findOne({
    participants: { $all: [userId, participantId] }
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [userId, participantId]
    });

    await User.findByIdAndUpdate(userId, { $push: { chats: chat._id } });
    await User.findByIdAndUpdate(participantId, { $push: { chats: chat._id } });
  }

  res.status(201).json({ success: true, chat });
});

// Get chat list details (name, avatar, id) along with chatId
exports.getChatList = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const chats = await Chat.find({ participants: userId });

  const chatList = [];

  for (const chat of chats) {
    const participantIds = chat.participants.filter(participant => participant.toString() !== userId.toString());

    const participants = await User.find({ _id: { $in: participantIds } })
      .select('_id name avatar');

    chatList.push({
      chatId: chat._id,
      participants: participants.map(participant => ({
        _id: participant._id,
        name: participant.name,
        avatar: participant.avatar
      }))
    });
  }

  res.status(200).json({
    success: true,
    chatList
  });
});


// Sending message
// exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
//   const { chatId, text } = req.body;
//   const sender = req.user.id;

//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     return res.status(404).json({ message: 'Chat not found' });
//   }
//   const newMessage = { sender, text };
//   chat.messages.push(newMessage);
//   await chat.save();

//   const populatedChat = await Chat.findById(chatId)
//     .populate({
//       path: 'messages.sender',
//       select: 'name avatar'
//     })
//     .exec();

//   const messageWithSender = populatedChat.messages[populatedChat.messages.length - 1];
//   if (!messageWithSender) {
//     return res.status(404).json({ message: 'Message not found' });
//   }
//   // Exclude _id from the message
//   const { _id, ...messageWithoutId } = messageWithSender.toObject();

//   res.status(200).json({ success: true, message: messageWithoutId });
// });

// Getting chat history with pagination
exports.getChatHistory = catchAsyncErrors(async (req, res, next) => {
  const { chatId } = req.params;
  const { lastMessageId } = req.query;
  const PAGE_SIZE = 20; 

  const chat = await Chat.findById(chatId).populate({
    path: 'messages.sender',
    select: 'name avatar'
  });
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  let messages;
  if (lastMessageId) {
    // Fetch messages older than the last message ID
    const lastMessage = await chat.messages.id(lastMessageId);
    messages = chat.messages
      .filter(message => message.createdAt < lastMessage.createdAt)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, PAGE_SIZE);
  } else {
    // Fetch the most recent messages
    messages = chat.messages
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, PAGE_SIZE);
  }

  // Check if there are more messages to load
  const hasMore = messages.length === PAGE_SIZE;

  const formattedMessages = messages.reverse().map(message => ({
    _id: message._id,
    text: message.text,
    sender: {
      _id: message.sender._id,
      name: message.sender.name,
      avatar: message.sender.avatar
    },
    createdAt: message.createdAt
  }));

  res.status(200).json({ success: true, messages: formattedMessages, hasMore });
});
