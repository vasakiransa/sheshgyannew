const baseUrl =
	typeof window !== "undefined"
		? window.location.origin
		: process.env.NODE_ENV === "production"
		? "https://elearniv-react.envytheme.com"
		: "http://localhost:3000"; // Default fallback for server-side

export default baseUrl;
