export function generateRandomID() {
	const randomString = Math.random().toString(36).substr(2, 10);
	const timestamp = Date.now();

	return `${randomString}_${timestamp}`;
}
