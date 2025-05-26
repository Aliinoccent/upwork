const pool = require("../config/db");
const{ getReceiverSocketId,io}=require('../socket/socket')

exports.messages = async (req, res) => {
    
    const { id: usertochatId } = req.params;
    const myId = req.user.user_id;
    try {
          const allMessages= pool.query('select * from messages where (sender_id=$1 and reciver_id=$2) or (sender_id=$2 and reciver_id=$1)',[myId,usertochatId])
          if( allMessages.rowCount===0){
            return res.status(200).json({message:'not massages'})
          } 
        res.status(200).json(allMessages)
    }
    catch (error) {
        console.log("error in messeges controller", error.message)
        res.status(500).json({ message: "server side error", error: error.message })
    }
}

exports.sendMessage = async (req, res) => {
    const { content} = req.body;
    const { id: reciverId } = req.params;
    const myid = req.user.user_id
    try {
        
        await pool.query('insert into messages (sender_id,reciver_id,content) values($1,$2,$3)',[myid,reciverId,content])
        const receiverSocketId = getReceiverSocketId(reciverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("mes", newMessage);
          console.log("this messege is sent to",receiverSocketId,newMessage);//this messege is sent to mDwETfHOs815DiQJAAAH
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("send message error controller", error.message);
        res.status(500).json({ message: error.message });
    }
}