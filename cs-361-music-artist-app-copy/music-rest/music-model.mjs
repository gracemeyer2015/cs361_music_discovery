
import mongoose from 'mongoose';


const MUSIC_DB_NAME = 'Artist'
const BASE = 'https://ws.audioscrobbler.com/2.0/'

export async function connect(){
    try{
       await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName: MUSIC_DB_NAME});
        console.log("Successfully connected to MongoDB using Mongoose!");
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

const artistSchema = mongoose.Schema({

    name:{type: String, required: true},
    bio:{type: String, required: true},
    genre:{type: String, required: true},
   imageBase64:{
        type: String
},
    

})


/**
 * Compile the model from the schema 
 */
export const Artist = mongoose.model(MUSIC_DB_NAME, artistSchema)

function params(obj){
    return new URLSearchParams({
        api_key: process.env.LASTFM_API_KEY,
        format: 'json',
        ...obj,
    }).toString()
}

async function call(method, extraParams){
    const qs = params({method, ...extraParams})
    const url = `${BASE}?${qs}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Last.fm error: ${res.status} `)
    return res.json()
}

export async function  searchArtists(query) {
    const data = await call('artist.search', {artist:query} )
    const artists = data.results.artistmatches.artist || []

    if(!artists.length) return []

    const limitResponse = artists.slice(0, 1)

    const artistDetailsResponse = await Promise.all(
        limitResponse.map(async (artist) => {
            const info = await getArtistInfo(artist.name)
            return {
                name: artist.name,
                bio: info?.bio || 'No bio found',
                genre: info?.genre || 'Unknown',
                image: artist.image?.[2]?.['#text'] || '',
            }
        })
    )   
        return artistDetailsResponse
    }
    
  

export async function getArtistInfo(name){
    const data = await call('artist.getInfo', {artist:name})
    const info = data?.artist
    if(!info) return null

    let genre = 'Unknown'
    if(info.tags && Array.isArray(info.tags.tag) && info.tags.tag.length > 0){
        genre = info.tags.tag[0].name
    }
    return {
        name: info.name,
        bio: info.bio.summary || 'No bio available',
        genre: genre
    }
}

