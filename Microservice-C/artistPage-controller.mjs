import express from 'express';
import asyncHandler from 'express-async-handler';
import { param, validationResult} from 'express-validator';
import getArtistInfo from './artistPage-model.mjs';

const router = express.Router();

function sendValidationErrors(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({Error: 'Invalid request', details: result.array()});
        return true;
    }
    return false;
}

router.get('/artist/:name',
    [param('name').isString().trim().notEmpty()],
    asyncHandler(async (req, res) => {
        if (sendValidationErrors(req, res)) return;

        const {name} = req.params;
        const artist = await getArtistInfo(name);
        res.status(200).json({artist});
    })
);

export default router;