import { Server } from 'socket.io';


const connectedUser = new Set();

const socketService = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Connected successfully', socket.id);
        socket.join("some room");
        connectedUser.add(socket.id);
        io.to("some room").emit('connected-user', connectedUser.size);
    
        socket.on('disconnect', () => {
          console.log('Disconnected successfully', socket.id);
          connectedUser.delete(socket.id);
          io.to("some room").emit('connected-user', connectedUser.size);
        });
    
        socket.on('manual-disconnect', () => {
          console.log('Manual disconnect requested', socket.id);
          socket.disconnect();
        });
    
        socket.on('message', async (data) => {
          console.log(data);
          socket.to("some room").emit('message-receive', data);
        });
    

        
        socket.on('sendMessage', async (data) => {
          const messageWithDate = {
              ...data,
              date: new Date().toISOString()
          };
          io.to("some room").emit('message-receive', messageWithDate);
      });
      
      });
};

export default socketService;