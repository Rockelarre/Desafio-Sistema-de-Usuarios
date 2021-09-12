// Importar módulos necesarios
const http = require('http');
const url = require('url');
const fs = require('fs');

// Importando funciones
const { insertar,consultar,validar } = require('./consultas')
// Crear servidor
http
    .createServer( async (req,res) => {

        // Ruta raíz
        if( req.url == '/' && req.method == 'GET') {
            res.setHeader('content-type','text/html');
            const html = fs.readFileSync('index.html','utf8');
            res.end(html);
        }

        // Ruta POST insertar()
        if (req.url == '/usuario' && req.method == 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));

                const respuesta = await insertar(datos);

                res.end(JSON.stringify(respuesta));
            })
        }

        // Ruta GET
        if ( req.url == '/usuarios' && req.method == 'GET') {
            const registros = await consultar();
            res.end(JSON.stringify(registros,null,1));
        }

        // Ruta POST validar()
        if (req.url == '/login' && req.method == 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));

                const respuesta = await validar(datos);

                if ( respuesta.rows[0].count != 0){
                    /* res.end(JSON.stringify(respuesta)); */
                    res.end();
                } else {
                    console.log('No hay registros que coincidan');
                }
            })
        }

    })
    .listen(3000,()=>console.log(`Server running on port 3000 and PID: ${process.pid}`))