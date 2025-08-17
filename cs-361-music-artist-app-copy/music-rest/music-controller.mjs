import asyncHandler from 'express-async-handler';
import * as lastfm from './music-model.mjs'
import {query, param, validationResult} from 'express-validator'
import {Router} from 'express'


const router = Router()


function sendValidationErrors(req,res) {
    const result = validationResult(req)
    if(!result.isEmpty()){
        res.status(400).json({Error: 'Invalid request', details: result.array() })
        return true 
    }
    return false
}


router.get('/artists/search', 
    [query('q').isString().trim().notEmpty()],
    asyncHandler(async(req,res)=>
{
    if(sendValidationErrors(req, res)) return

    const {q} = req.query
    const artists = await lastfm.searchArtists(q)
    res.status(200).json({artists})

}))

router.get('/artists/:name/info', 
    [param('name').isString().trim().notEmpty()],
    asyncHandler(async (req, res) => {
        if(sendValidationErrors(req,res)) return
    
        const{name} = req.params
        const artistData = await lastfm.getArtistInfo(name)

        if(!artistData){
            return res.status(404).json({Error:'Artist not found'})
        }
        res.status(200).json(artistData)
    })
)

const MICRO_A_URL = 'http://localhost:3500'

async function safeParseJson(response){
    try{
        return await response.json()
    } catch{
        return await response.text()
    }
}

router.post(
    '/library', 
    asyncHandler(async(req, res)=> {
        
    const response = await fetch(`${MICRO_A_URL}/library`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req.body)
    })
    if(!response.ok){
        const errorData = await safeParseJson(response)
        return res.status(response.status).json(errorData)
    }
    const data = await safeParseJson(response)
    res.status(201).json(data)
    })
        
);

router.get('/library', asyncHandler(async(req, res)=>{
    const response = await fetch(`${MICRO_A_URL}/library`)
    if(!response.ok){
        const errorData = await safeParseJson(response)
        return res.status(response.status).json(errorData)
    }
    const data = await safeParseJson(response)
    res.status(200).json(data)
}))

router.delete('/library/:id', asyncHandler(async(req, res)=>{
    const response = await fetch(`${MICRO_A_URL}/library/${req.params.id}`, {
        method: 'DELETE'
    })
    if(response.status === 204){
        return res.status(204).send()
    }else{
        const data = await safeParseJson(response)
        return res.status(response.status).json(data)
    }
}))

const MICRO_SIMILAR_URL = process.env.MICRO_SIMILAR_URL || 'http://localhost:3600'   
const MICRO_ARTIST_URL =  process.env.MICRO_ARTIST_URL || 'http://localhost:3700'

router.get('/similar',
    [query('artist').isString().trim().notEmpty()],
    asyncHandler(async (req, res) => {
        if(sendValidationErrors(req, res)) return

        const {artist} = req.query
        const response = await fetch(`${MICRO_SIMILAR_URL}/similar?artist=${encodeURIComponent(artist)}`)
        if(!response.ok){
            const errorData = await safeParseJson(response)
            return res.status(response.status).json(errorData)
        }
        const data = await safeParseJson(response)

        const detailedArtists = await Promise.all(
            (data.similarArtists || []).map(async (similarArtist)=> {
                try{
                    const artistResponse = await fetch(`${MICRO_ARTIST_URL}/artist/${encodeURIComponent(similarArtist.name)}`)
                    if(!artistResponse.ok){
                        console.error(`Failed to fetch artist details for ${similarArtist.name}: ${artistResponse.statusText}`)
                        return similarArtist
                    }
                    const artistData = await artistResponse.json()
                    const info = artistData.artist || artistData
                    return {...similarArtist,...info}
                
                }catch(err){
                    console.error(`Error fetching artist details for ${similarArtist.name}:`, err)
                    return similarArtist
                }
            })
        )
        res.status(200).json({similarArtists: detailedArtists})
        
    })
)

const MICRO_UPDATE_URL = process.env.MICRO_UPDATE_URL || 'http://localhost:3800'

router.put('/library/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const {imageBase64} = req.body;

    if (!imageBase64) {
        return res.status(400).json({Error: 'Image base64 data is required'});
    }
    const response = await fetch(`${MICRO_UPDATE_URL}/library/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({imageBase64})
    });
    if (!response.ok) {
        const errorData = await safeParseJson(response);
        return res.status(response.status).json(errorData);
    }
    const updatedArtist = await safeParseJson(response);
    res.status(200).json(updatedArtist);
}));



export default router
