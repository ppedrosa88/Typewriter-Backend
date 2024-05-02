const http = require('http');

function findAvailablePort(app) {
    return new Promise((resolve, reject) => {
        const server = http.createServer(app);
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                findAvailablePort().then(resolve).catch(reject);
            } else {
                reject(err);
            }
        });
        server.listen(0, () => {
            const port = server.address().port;
            server.close(() => {
                resolve(port);
            });
        });
    });
}

// async function startServer(app) {

//     // Todo: Remove port constant to const port = await findAvailablePort(app);


//     try {
//         // const port = await findAvailablePort(app);
//         const port = 3002;
//         app.listen(port, () => {
//             console.log(`Server running on port ${port}`);
//         });
//     } catch (err) {
//         console.error('Failed to find an available port:', err);
//     }
// }

// module.exports = startServer;