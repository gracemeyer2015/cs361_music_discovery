import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import {Artist, connect} from '../cs-361-music-artist-app-copy/music-rest/music-model.mjs';

await connect();

export async function updateArtist(id, imageBase64) {
    

    return Artist.findByIdAndUpdate(
        id, 
        {imageBase64}, 
        {new: true})
}