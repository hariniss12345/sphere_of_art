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

chatCltr.update = async (req, res) => {
    try {
        const { chatId } = req.params; // Extract chatId correctly
        const { newMessage } = req.body;

        if (!newMessage) {
            return res.status(400).json({ message: "New message content is required" });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId, 
            { message: newMessage }, 
            { new: true, runValidators: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.json(updatedChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


chatCltr.delete = async (req,res) => {
    try {
        const { chatId } = req.params;
        console.log(chatId)
        const deletedChat = await Chat.findByIdAndDelete(chatId);
        if (!deletedChat) {
          return res.status(404).json({ message: "Message not found" });
        }
    
        res.json({ message: "Chat deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

export default chatCltr
