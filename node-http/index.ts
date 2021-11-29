import { IncomingMessage, ServerResponse, createServer } from 'http';

const HOSTNAME = 'localhost';
const PORT = 3000;

const server = createServer( (req: IncomingMessage, res: ServerResponse) => {
    console.log(req.headers);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>Hello World!</h1></body></html>')
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on port ${PORT}`);
});