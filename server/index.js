import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/roll-dice', ( _ , res) => {
    
    const dice = Math.floor(Math.random() * 6) + 1;
    res.json({ dice });

    }
);

app.listen(5000, () => {
    console.log("serever is running on http://localhost:5000");
});