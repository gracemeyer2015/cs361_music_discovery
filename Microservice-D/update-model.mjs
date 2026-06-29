import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';


const MUSIC_DB_NAME = 'Artist'

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

await connect();

export async function updateArtist(id, imageBase64) {
    

    return Artist.findByIdAndUpdate(
        id, 
        {imageBase64}, 
        {new: true})
}