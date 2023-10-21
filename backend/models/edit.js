// Function that handles the separation of tickets being updated
// const tickets = require('./tickets');
import tickets from './tickets';
// Auth model
// const authModel = require('./auth');
import authModel from './auth';

function editTicket(io) {
    // Get all tickets
    let allTickets = [];
    // List with tickets that are being edited
    let editedTickets = [];

    io.sockets.on('connection', function(socket) {
        // Emit all tickets
        socket.on('fetchTickets', async () => {
            allTickets = tickets.getTickets();
            socket.emit("tickets", allTickets);
        })

        // Emit fetched tickets
        socket.on('fetchBlockedTickets', () => {
            socket.emit("blockedTickets", editedTickets);
        })

        // Set ticket as locked/blocked when a client is editing
        socket.on('startEditingTicket', (data) => {
            // Add the _id of the ticket being modified ONLY if authorized
            // This will stop an unauthorized user from locking tickets,
            // Control to actually edit tickets in database is done through frontend 
            const isAuth = authModel.ssCheckToken(data.jwt)

            if (isAuth) {
                editedTickets.push(data.id);
            }

            io.emit('blockedTickets', editedTickets);
        })

        // Unlock/unblock a ticket that has been edited
        socket.on('stopEditingTicket', (data) => {
            let index = editedTickets.indexOf(data);

            // Removes the _id of the ticket being modified
            // Making sure nothing is removed by mistake index can't be -1
            if (index !== -1) {
                editedTickets.splice(index, 1);
                io.emit('blockedTickets', editedTickets);
            }
        })

        // Update tickets when needed, when creating or changing
        socket.on('updateTickets', async (ticketData) => {
            // ticketData is provided when updating or creating new ticket
            if (ticketData) {
                allTickets = tickets.getTickets();
            }
            io.emit('tickets', allTickets);
        })
    })
}

// module.exports = editTicket;
export default editTicket;
