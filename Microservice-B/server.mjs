import express from 'express';
import cors from 'cors';
import router from './similar-controller.mjs'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());


app.use('/', router);

const PORT = process.env.SIMILAR_PORT || 3600;

app.listen(PORT, () => {
  console.log(`Similar service is running on port ${PORT}`);
})