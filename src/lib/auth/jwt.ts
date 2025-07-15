import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export function generateAccessToken(payload: object) {
	return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: object) {
	return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
	try {
		return jwt.verify(token, env.JWT_SECRET);
	} catch {
		return null;
	}
}

export function verifyRefreshToken(token: string) {
	try {
		return jwt.verify(token, env.JWT_REFRESH_SECRET);
	} catch {
		return null;
	}
}

export function getAccessTokenCookieConfig() {
	return {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		// maxAge: 10
		maxAge: 60 * 15 // 15 minutes
	};
}

export function getRefreshTokenCookieConfig() {
	return {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	};
}
