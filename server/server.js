import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connection } from './database/conn.js';
import router from './router/route.js';

const app = express();


/* -------------------------- middlewares */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack




/* -------------------------- HTTP GET Request */

app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
});



/* -------------------------- api routes */

app.use('/api', router)



/* -------------------------- start server only when we have valid connection */


async function finalConnection() {
    try {
        const PORT = 8080;
        await connection()
        console.log('Database Connected Successfully...');
        app.listen(PORT, () => {
            console.log(`Server connected to http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}


finalConnection();









// connect().then(() => {
//     try {
//         app.listen(PORT, () => {
//             console.log(`Server connected to http://localhost:${port}`);
//         })
//     } catch (error) {
//         console.log('Cannot connect to the server')
//     }
// }).catch(error => {
//     console.log("Invalid database connection...!");
// })

