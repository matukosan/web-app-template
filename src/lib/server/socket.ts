import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: Server;

export const initSocket = (server: HTTPServer) => {
	io = new Server(server, {
		cors: {
			origin: import.meta.env.VITE_PUBLIC_ORIGIN || 'http://localhost:5173',
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', (socket) => {
		console.log('Client connected', socket.id);

		socket.on('disconnect', () => {
			console.log('Client disconnected', socket.id);
		});

		// Add your custom event handlers here
		socket.on('client:message', (message: string) => {
			// Broadcast to all clients except sender
			socket.broadcast.emit('server:message', {
				message,
				socketId: socket.id
			});
		});
	});

	return io;
};

export const getIO = () => {
	if (!io) {
		throw new Error('Socket.IO has not been initialized');
	}
	return io;
};
