var http = require('http');

const server = http.createServer();
server.on('request',(request,response)=>{
    console.log('this is a incoming request');
});

server.listen(8080);