import express from 'express';
import cors from 'cors';
import router from './update-controller.mjs'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '5mb' }));


app.use('/', router);

const PORT = process.env.PAGE_PORT || 3800;

app.listen(PORT, () => {
  console.log(`Update service is running on port ${PORT}`);
})