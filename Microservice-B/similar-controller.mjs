import express from 'express';
import {query, param, validationResult} from 'express-validator';
import asyncHandler from 'express-async-handler';
import getSimilar from './similar-model.mjs';



const router = express.Router();

function sendValidationErrors(req,res) {
    const result = validationResult(req)
    if(!result.isEmpty()){
        res.status(400).json({Error: 'Invalid request', details: result.array() })
        return true 
    }
    return false
}

router.get('/similar',
    [query('artist').isString().trim().notEmpty().withMessage('Artist name is required'),],
    asyncHandler(async (req, res) => {
        if (sendValidationErrors(req, res)) return;

        const {artist} = req.query;
        const limit = parseInt(req.query.limit) || 5;

        const results = await getSimilar(artist, limit);
        res.json({similarArtists: results});

}))


export default router;