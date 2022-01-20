const { Sequelize, Op } = require("sequelize");
const Users = require('../models').user;
const Chats = require('../models').chat;
const Messages = require('../models').message;
const { response } = require('oba-http-response');

exports.sendMessage = async(req, res) => {
    const { text, userId, receiverId } = req.body;
    try {
        if(!(text && userId && receiverId)) return response(res, 400, null, 'Please supply missing input(s)');
        const chat = await Chats.findOne({ where: {
                [Op.or]: [
                    {
                        senderId: userId,
                        receiverId,
                        isDeleted: false
                    },
                    {
                        senderId: receiverId,
                        receiverId: userId,
                        isDeleted: false
                    }
                ] 
            }});
            if(chat) {
                await Messages.create({chatId: chat.id, text, senderId: userId});
                const newChat = await Chats.findOne({
                    where: {
                        [Op.or]: [
                            {
                                senderId: userId,
                                receiverId,
                                isDeleted: false
                            },
                            {
                                senderId: receiverId,
                                receiverId: userId,
                                isDeleted: false
                            }
                        ] 
                    },
                    include: [
                        {model: Users, as: 'chatSender',
                                    attributes: ['username', 'email', 'imageUrl']
                        },
                        {model: Users, as: 'chatReceiver',
                                    attributes: ['username', 'email', 'imageUrl']
                        },
                        {model: Messages, as: 'messages',
                            where: { isDeleted: false },
                            include: [
                                {model: Users, as: 'sender',
                                    attributes: ['username', 'email', 'imageUrl']
                                }
                            ]
                        }
                    ]
                });
                response(res, 201, newChat, null, 'Message sent');
            } else {
                const chat = await Chats.create({senderId: userId, receiverId});
                await Messages.create({chatId: chat.id, text, senderId: userId});
                const newChat = await Chats.findOne({
                    where: {
                        [Op.or]: [
                            {
                                senderId: userId,
                                receiverId,
                                isDeleted: false
                            },
                            {
                                senderId: receiverId,
                                receiverId: userId,
                                isDeleted: false
                            }
                        ] 
                    },
                    include: [
                        {model: Users, as: 'chatSender',
                        attributes: ['username', 'email', 'imageUrl']
                        },
                        {model: Users, as: 'chatReceiver',
                                    attributes: ['username', 'email', 'imageUrl']
                        },
                        {model: Messages, as: 'messages',
                            where: { isDeleted: false },
                            include: [
                                {model: Users, as: 'sender',
                                    attributes: ['username', 'email', 'imageUrl']
                                }
                            ]
                        }
                    ]
                });
                    response(res, 201, newChat, null, 'Message sent');
            }

        }catch(error) {
            response(res, 500, null, error.message, 'Error in sending message');
        }
}; 

exports.getAllChats = async(req, res) => {
    const { userId } = req.body;
    try {
        if(!userId) return response(res, 400, null, 'userId is required');
        const chat = await Chats.findAll({ 
                where: {
                    [Op.or]: [
                        {
                            senderId: userId,
                            isDeleted: false
                        },
                        {
                            receiverId: userId,
                            isDeleted: false
                        }
                    ]
                },
                include: [
                    {model: Users, as: 'chatSender',
                    attributes: ['username', 'email', 'imageUrl']
                    },
                    {model: Users, as: 'chatReceiver',
                                attributes: ['username', 'email', 'imageUrl']
                    },
                    {model: Messages, as: 'messages', 
                        where: { isDeleted: false },
                        include: [
                            {model: Users, as: 'sender',
                                attributes: ['username', 'email', 'imageUrl']
                            }
                        ]
                    }
                ]
            });

            response(res, 200, chat, null, 'List of chats');

        }catch(error) {
            response(res, 500, null, error.message, 'Error in retrieving chats');
        }
}; 

exports.getChat = async(req, res) => {
    const { userId } = req.body;
    const { receiverId } = req.params;
    try {
        if(!(userId && receiverId)) return response(res, 400, null, 'Please supply missing input(s)');
        const chat = await Chats.findOne({
            where: {
                [Op.or]: [
                    {
                        senderId: userId,
                        receiverId,
                        isDeleted: false
                    },
                    {
                        senderId: receiverId,
                        receiverId: userId,
                        isDeleted: false
                    }
                ] 
            },
            include: [
                {model: Messages, as: 'messages', 
                    where: { isDeleted: false },
                    include: [
                        {model: Users, as: 'sender',
                            attributes: ['username', 'email', 'imageUrl']
                        }
                    ]
                }
            ]
        });
            response(res, 200, chat, null, 'List of chats');

        }catch(error) {
            response(res, 500, null, error.message, 'Error in retrieving chats');
        }
}; 

exports.updateMessage = async(req, res) => {
    const { userId, text } = req.body;
    const { messageId } = req.params;
    try {
          if(!(userId && text && messageId)) return response(res, 400, null, 'Please supply missing input(s)');
          const messageExist = await Messages.findByPk(messageId);
          if(!messageExist) return response(res, 400, null, 'Message not found');

          await Messages.update({text}, {where: {
              id: messageId
          }});
        const chat = await Chats.findOne({
            where: {
                id: messageExist.chatId
            },
            include: [
                {model: Messages, as: 'messages',
                    where: { isDeleted: false },
                    include: [
                        {model: Users, as: 'sender',
                            attributes: ['username', 'email', 'imageUrl']
                        }
                    ]
                }
            ]
        });
            response(res, 200, chat, null, 'Message updated');

        }catch(error) {
            response(res, 500, null, error.message, 'Error in retrieving chat messages');
        }
}; 

exports.deleteMessage = async(req, res) => {
    const { userId } = req.body;
    const { messageId } = req.params;
    try {
          if(!(userId && messageId)) return response(res, 400, null, 'Please supply missing input(s)');
          const messageExist = await Messages.findByPk(messageId);
          if(!messageExist) return response(res, 400, null, 'Message not found');

          await Messages.update({ isDeleted: true }, {where: {
              id: messageId
          }});

            response(res, 200, null, null, 'Message deleted');

        }catch(error) {
            response(res, 500, null, error.message, 'Error in retrieving chat messages');
        }
}; 

exports.deleteChat = async(req, res) => {
    const { userId } = req.body;
    const { receiverId } = req.params;
    try {
        if(!(userId && receiverId)) return response(res, 400, null, 'Please supply missing input(s)');
        const chatExist = await Chats.findOne({ where: {
            [Op.or]: [
                {
                    senderId: userId,
                    receiverId,
                    isDeleted: false
                },
                {
                    senderId: receiverId,
                    receiverId: userId,
                    isDeleted: false
                }
            ] 
        }});
          if(!chatExist) return response(res, 400, null, 'Chat not found');

          await Chats.update({ isDeleted: true }, {where: {
              id: chatExist.id
          }});
            response(res, 200, null, null, 'Chat deleted');

        }catch(error) {
            response(res, 500, null, error.message, 'Error in retrieving chat messages');
        }
}; 