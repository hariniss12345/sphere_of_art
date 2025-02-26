import Chat from '../models/chat-model.js'

const chatCltr = {}

chatCltr.create = async (req, res) => {
    try {
        const { orderId, senderId, receiverId, message } = req.body;
        const newMessage = new Chat({ orderId, senderId, receiverId, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

chatCltr.list =  async (req, res) => {
    try {
        const messages = await Chat.find({ orderId: req.params.orderId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

export default chatCltr
