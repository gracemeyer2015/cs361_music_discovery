// Name : Rithik reddy

import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { body, param, validationResult } from 'express-validator';


import * as users from './users_model.mjs';



const app = express();
app.use(express.json({ limit: '5mb' }))

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    await users.connect()
    console.log(`Server listening on port ${PORT}...`);
});

function sendValidationErrors(req, res) { 
    const result = validationResult(req); 
    if (!result.isEmpty()){ 
        res.status(400).json({ error: 'Invalid request', details: result.array() })
         return true 
    } 
    return false 
}


app.post( '/library',
   [
    body('name').isString().trim().notEmpty(),
    body('bio').isString().trim().notEmpty(),
    body('genre').isString().trim().notEmpty(),
    ], 
    asyncHandler(async (req, res) => { 
        if (sendValidationErrors(req, res)) return;


    const {name, bio, genre, imageBase64} = req.body;
    const user = await users.createArtist({name, bio, genre, imageBase64})
    res.status(201).json(user);
}));

app.get('/library', asyncHandler(async (req, res) => {
    const userValues = await users.getUser();

    //transform the data to include base64 encoded image
    const transformedUsers = userValues.map(user => {
        const userObj = user.toObject();
        userObj.imageBase64 = userObj.imageBase64 
        return userObj;
    });
    res.status(200).json(transformedUsers);
}));


app.delete('/library/:id', asyncHandler(async (req, res) => {
    if (sendValidationErrors(req, res)) return;
    const id = req.params.id;
    const deleted = await users.deleteById(id);
    if (deleted === 1){
        res.status(204).send();
    }else{
        res.status(404).json({"Error": "Not found"});
    }
}));

