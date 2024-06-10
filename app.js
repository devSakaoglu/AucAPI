import db from './Db.js';
import express from 'express';

const app = express();
// Define your routes and middleware here
app.get('/', (req, res) => {
    const data = {
        message: 'Hello World!'
    };
    res.json(data);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


export default app;
