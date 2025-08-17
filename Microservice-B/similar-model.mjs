import 'dotenv/config';

const BASE = 'https://ws.audioscrobbler.com/2.0/';



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

async function getSimilar(artistName, limit = 5){
    const data = await call('artist.getSimilar',{artist: artistName, limit});
    const similarArtists = data?.similarartists?.artist || [];
    if (!similarArtists.length) return [];

    return similarArtists.map(artist =>({
        name: artist.name,
        bio: 'No bio available for similar artists',
        genre: artist.tags?.tag?.name || 'Unknown',
        image: artist.image?.[2]?.['#text'] || '',

    }) )

}



export default getSimilar

