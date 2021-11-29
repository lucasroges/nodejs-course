import { IncomingMessage, ServerResponse, createServer } from 'http';
import { exists, createReadStream, createWriteStream } from 'fs';
import { resolve, extname } from 'path';

const HOSTNAME = 'localhost';
const PORT = 3000;

const server = createServer( (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    console.log(`Request for ${url} by method ${method}`);

    if (method === 'GET') {
        const fileUrl = url === '/' ? '/index.html' : url;

        const filePath = resolve(`./public${fileUrl}`);

        const fileExt = extname(filePath);

        if (fileExt === '.html') {
            exists(filePath, (exists) => {
                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                createReadStream(filePath).pipe(res);
            })
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><h1>Error 400: ${fileUrl} is not a html file</h1></body></html>`);
        }
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html><body><h1>Error 400: method ${method} not supported</h1></body></html>`);
    }
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on port ${PORT}`);
});