import 'dotenv/config';

const BASE = 'https://ws.audioscrobbler.com/2.0/';
const MAIN_BACKEND = process.env.MUSIC_REST_URL || 'http://localhost:3700'; 


export function queryParams(obj) {
    return new URLSearchParams({
        api_key: process.env.LASTFM_API_KEY,
        format: 'json',
        ...obj,
    }).toString();
}



async function call(method, extraParams){
    const qString = queryParams({method, ...extraParams});
    const url = `${BASE}?${qString}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Last.fm error: ${res.status}`);
    return res.json();
}

async function getArtistInfo(name) {
    let info = null
    try{
        const data = await call('artist.getInfo', {artist: name})
        info = data?.artist || null
    } catch (err) {
        console.error(`Error fetching artist info for ${name}:`, err)
        info = null
    }

    let saved = null
    try {
        const response = await fetch(`${MAIN_BACKEND}/library`)
        if (response.ok) {
            const libArtists = await response.json()

            const savedArr = Array.isArray(libArtists) ? libArtists : libArtists.artists || libArtists
            saved = savedArr.find((artist) => artist.name.toLowerCase() === name.toLowerCase())
        }   
     } catch (err) {
            console.error(`Error fetching library data:`, err)
            saved = null
        }
    
    const combinedInfo = {
        name: (saved && saved.name) || info?.name || name,
        bio: (saved && saved.bio) || info?.bio?.summary || info?.bio?.content || 'No bio available', 
        genre: (saved && saved.genre) || (info?.tags?.tag?.[0]?.name || 'Unknown'),
        imageBase64: saved?.imageBase64 || saved?.image?.data || null,
        listeners: info?.stats?.listeners || 0,
        playcount: info?.stats?.playcount || 0,
    }
    return combinedInfo
    

}

export default getArtistInfo