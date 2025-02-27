import Chat from '../models/chat-model.js'

const chatCltr = {}


chatCltr.list =  async (req, res) => {
    try {
        const messages = await Chat.find({ orderId: req.params.orderId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 


export default chatCltr
