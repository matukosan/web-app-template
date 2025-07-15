export function getTimeElapsed(createdAt: Date): string {
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

	if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
	if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
	return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export function formatDateTime(date: Date): string {
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}
