import {Schema,model} from "mongoose";

const chatSchema = new Schema({
    orderId: { 
        type: Schema.Types.ObjectId,
        ref: "Order",
     },
    senderId: { 
        type: Schema.Types.ObjectId,
        ref: "User"
     },
    receiverId: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
     },
    message:  String,
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat