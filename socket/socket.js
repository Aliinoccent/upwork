const express=require('express');
const http =require('http');
const {Server}=require('socket.io');
const app=express();
const server=http.createServer(app);
const io=new Server( server,{
    cors:{
        origin: 'http://127.0.0.1:5500',   
    }
})
const usersSockets={};
const getReceiverSocketId=(userId)=>{
    return usersSockets[userId];
}
io.on('connection',(socket)=>{
    const user_id=socket.handshake.query.userId
    if(user_id){
        usersSockets[user_id]=socket.id;
    }

    console.log("connected socket",socket.id);
    socket.emit('send',"helo how are you");
})
module.exports={server,express,app,getReceiverSocketId}