export function generateRandomID() {
	const randomString = Math.random().toString(36).substr(2, 10); // Generate a random string of length 10
	const timestamp = Date.now(); // Get the current timestamp

	return `${randomString}_${timestamp}`;
}
