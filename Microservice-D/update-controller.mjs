import express from 'express';
import asyncHandler from 'express-async-handler';
import { updateArtist } from './update-model.mjs';

const router = express.Router();    

router.put('/library/:id',
    asyncHandler(async(req,res) => {
        const id = req.params.id;
        const {imageBase64} = req.body;

        if (!imageBase64) {
            return res.status(400).json({Error: 'Image data is required'});
        }
        const updatedArtist = await updateArtist(id, imageBase64);
        if (!updatedArtist) {
            return res.status(404).json({Error: 'Artist not found'});
        }
        res.status(200).json(updatedArtist);
    })
);



export default router;