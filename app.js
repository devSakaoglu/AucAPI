// import db from './Db.js';
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
app.get('/tickets', (req, res) => {
    const data   ={test:[
        1,2,3,4,5,6,7
        ]
    }
    return res.status(200).json(data);
}
);


