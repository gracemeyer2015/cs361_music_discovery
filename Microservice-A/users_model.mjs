// Name : Rithik reddy

// Get the mongoose object
import mongoose from 'mongoose';
import 'dotenv/config';


const USER_CLASS = 'Artist';

let connection = undefined;

/**
 * This function connects to the MongoDB server.
 */
async function connect(){
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName: 'Artist'});
        connection = mongoose.connection;
        console.log("Successfully connected to MongoDB using Mongoose!");
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}


/**
 * Define the schema
 */
const userSchema = mongoose.Schema({
    // TODO: Define the schema to represent users
    name:{type: String, required: true},
    bio:{type: String, required: true},
    genre:{type: String, required: true},
    imageBase64: {type: String}
    
});


const User = mongoose.model(USER_CLASS, userSchema);


const createUser = async (name, bio, image, genre) => {
    // Call the constructor to create an instance of the model class User
    const user = new User({ name: name, bio: bio, image: image, genre: genre });
    // Call save to persist this object as a document in MongoDB
    return user.save();
}

const getUser = async () => {
    const query = User.find();
    return query.exec();
}

const deleteById = async (userID) => {
    const result = await User.deleteOne({_id: userID});
    return result.deletedCount;
}

const createArtist = async({name, bio, genre, imageBase64})=>{
    const artist = new User({
        name,
        bio,
        genre,
        imageBase64: imageBase64 || null,
    });
    return artist.save();
}


export { createArtist, connect, createUser, getUser, deleteById};
