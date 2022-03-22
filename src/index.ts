import  express  from "express";
import socket from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);
app.use(express.static(__dirname + '/../public'))
const io = socket(httpServer, {
  path: '/socket.io'
});
const clients: Array<any>  = [];
io.on('connection', (client) => {
  console.log(`client on ${client.id}`)
  clients.push(client)

  client.on('disconnect', () => {
    clients.splice(clients.indexOf(client), 1);
    console.log(`client disconnected ${client.id}`)
  });
  console.log(clients.length)
})
app.get('/goku', (req,res) => {
  const msg = req.query.goku || '';
  for(const client of clients){
    client.emit('goku', msg);
    res.json({
      ok: true
    })

  }
});
httpServer.listen(PORT, () => {
  console.log(`Server on at ${PORT}`)
})