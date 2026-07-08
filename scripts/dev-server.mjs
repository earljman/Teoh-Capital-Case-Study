import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import http from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const viteHost = 'localhost';
const vitePort = 5173;
const port = 8888;

const MIME = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.pdf': 'application/pdf'
};

async function serveStatic(req, res, url) {
	let pathname = decodeURIComponent(url.pathname);
	if (pathname.endsWith('/')) pathname += 'index.html';

	const filePath = normalize(join(dist, pathname));
	if (!filePath.startsWith(dist)) {
		res.writeHead(403);
		res.end('Forbidden');
		return;
	}

	try {
		const fileStat = await stat(filePath);
		if (!fileStat.isFile()) {
			res.writeHead(404);
			res.end('Not found');
			return;
		}

		const ext = extname(filePath);
		const headers = {
			'Content-Type': MIME[ext] ?? 'application/octet-stream',
			'Cache-Control': 'no-store',
			'Content-Length': String(fileStat.size)
		};

		// Honor ?download=1 / download attribute intent for research PDFs
		if (ext === '.pdf' && url.searchParams.has('download')) {
			const name = filePath.split('/').pop() ?? 'download.pdf';
			headers['Content-Disposition'] = `attachment; filename="${name}"`;
		}

		res.writeHead(200, headers);
		createReadStream(filePath).pipe(res);
	} catch {
		res.writeHead(404);
		res.end('Not found');
	}
}

function proxyToVite(req, res) {
	const proxyReq = http.request(
		{
			hostname: viteHost,
			port: vitePort,
			path: req.url,
			method: req.method,
			headers: {
				...req.headers,
				host: `${viteHost}:${vitePort}`
			}
		},
		(proxyRes) => {
			res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
			proxyRes.pipe(res);
		}
	);

	proxyReq.on('error', (error) => {
		console.error('[dev-server] proxy error:', error.message);
		res.writeHead(502);
		res.end('Demo dev server unavailable. Ensure Vite is running on port 5173.');
	});

	if (req.method === 'GET' || req.method === 'HEAD') {
		proxyReq.end();
	} else {
		req.pipe(proxyReq);
	}
}

function proxyUpgrade(req, socket, head) {
	const proxyReq = http.request({
		hostname: viteHost,
		port: vitePort,
		path: req.url,
		method: req.method,
		headers: {
			...req.headers,
			host: `${viteHost}:${vitePort}`
		}
	});

	proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
		const headers = Object.entries(proxyRes.headers)
			.filter(([, value]) => value !== undefined)
			.map(([key, value]) => `${key}: ${value}`)
			.join('\r\n');
		socket.write(`HTTP/1.1 ${proxyRes.statusCode} ${proxyRes.statusMessage}\r\n${headers}\r\n\r\n`);
		if (proxyHead.length) socket.write(proxyHead);
		proxySocket.pipe(socket);
		socket.pipe(proxySocket);
	});

	proxyReq.on('error', () => socket.destroy());
	proxyReq.end();
}

const server = http.createServer((req, res) => {
	const url = new URL(req.url ?? '/', `http://localhost:${port}`);

	if (url.pathname === '/demo') {
		res.writeHead(301, { Location: '/demo/' });
		res.end();
		return;
	}

	if (url.pathname.startsWith('/demo/')) {
		proxyToVite(req, res);
		return;
	}

	serveStatic(req, res, url);
});

server.on('upgrade', (req, socket, head) => {
	const url = new URL(req.url ?? '/', `http://localhost:${port}`);
	if (!url.pathname.startsWith('/demo/')) {
		socket.destroy();
		return;
	}
	proxyUpgrade(req, socket, head);
});

await access(dist).catch(() => {
	console.warn('[dev-server] dist/ not found yet; run sync:deck-dist or npm run dev.');
});

server.listen(port, () => {
	console.log(`[dev-server] Slides at http://localhost:${port}/`);
	console.log(`[dev-server] Demo proxied at http://localhost:${port}/demo/ → vite:${vitePort}`);
});
