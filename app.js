var http    =   require('http');
var fs      =   require('fs');
// Création du serveur
var app = http.createServer(function (req, res) {
    // On lit notre fichier tchat.html
    fs.readFile('./tchat.html', 'utf-8', function(error, content) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(content);
    });
});

// Variables globales
// Ces variables resteront durant toute la vie du seveur et sont communes pour chaque client (node server.js)
// Liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [];

//// SOCKET.IO ////

var io      =   require('socket.io');

// Socket.IO écoute maintenant notre application !
io = io.listen(app); 

// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {
    // On donne la liste des messages (événement créé du côté client)
    socket.emit('recupererMessages', messages);
    // Quand on reçoit un nouveau message
    socket.on('nouveauMessage', function (mess) {
        // On l'ajoute au tableau (variable globale commune à tous les clients connectés au serveur)
        messages.push(mess);
        // On envoie à tout les clients connectés (sauf celui qui a appelé l'événement) le nouveau message
        socket.broadcast.emit('recupererNouveauMessage', mess);
    });
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
});

///////////////////

// Notre application écoute sur le port 8080
app.listen(8080);
console.log('Live Chat App running at http://localhost:8080/');
