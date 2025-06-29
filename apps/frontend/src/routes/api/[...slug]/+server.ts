// src/routes/api/[...slug]/+server.ts

import { env } from '$env/dynamic/private';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * This is a server-side proxy that forwards API requests from the frontend to the backend.
 * It catches all routes under `/api/` and forwards them to the FastAPI server.
 *
 * Why is this needed?
 * 1.  **Hides the Backend URL**: The browser never knows the direct URL of the backend service.
 * 2.  **Simplifies Frontend Code**: The frontend can just call `fetch('/api/news')` without worrying about different URLs in development vs. production.
 * 3.  **Works in All Environments**: It uses the `BACKEND_URL` private env var in production (e.g., `http://backend:8000`) and the `VITE_BACKEND_URL` public env var in local dev (`http://localhost:8000`).
 */
export const fallback: RequestHandler = async ({ request, params }) => {
	const backendUrl = env.BACKEND_URL || import.meta.env.VITE_BACKEND_URL;

	if (!backendUrl) {
		return new Response('Backend service is not configured', { status: 500 });
	}

	// Construct the full target URL
	const targetPath = params.slug;
	const targetUrl = `${backendUrl}/${targetPath}${request.url.search}`;

	// Forward the request, preserving the method, headers, and body
	const response = await fetch(targetUrl, {
		method: request.method,
		headers: request.headers,
		body: request.body,
		duplex: 'half' // Required for streaming request bodies
	});

	// Return the backend's response directly to the client
	return response;
};
