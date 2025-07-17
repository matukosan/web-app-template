import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { env } from '$env/dynamic/private';

let io: Server;

export const initSocket = (server: HTTPServer) => {
	const corsConfig =
		env.NODE_ENV === 'development'
			? {
					origin: '*', // Allow any origin in development
					methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
					credentials: true
				}
			: {
					origin: import.meta.env.VITE_PUBLIC_ORIGIN || 'http://localhost:5173',
					methods: ['GET', 'POST']
				};

	io = new Server(server, {
		cors: corsConfig
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
