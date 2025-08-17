# Microservice A

Functionality: This microservice has REST API endpoints to save, fetch, and delete an artist in a MongoDB database for a personal music library application.

# Communication contract


## How to request data

You can request data from the microservice by sending an HTTP post request to '/library' with the JSON object in the request body.

The JSON body you send for this request should follow the given format :

```json
{
  "name": "Artist Name",
  "image": "https://image.com/artistName.jpg",
  "bio": "this bio talks a little bit about the artist you are trying to create",
  "genre": "genre of the artist"
}
```

Below is an example of how to call the **POST /library** endpoint to save a new artist to the MongoDB database.
```js
   await fetch('http://localhost:3000/library', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
      name: "Travis Scott",
      bio: "A passionate artist",
      image: "https://example.com/image.jpg",
      genre: "hip-hop"
    })
  });
```
  
The above code sends an HTTP request to the microservice's /library endpoint, asking for the artist sent in the body to be saved to the database.

## How to receive data

To receive data from the microservice, you will have to send an HTTP GET request to the /library endpoint. This request will retrieve all the saved artists stored in the database and return a JSON array with the data.

``` js
const res= await fetch('http://localhost:3000/library');
const data = await res.json();
//To print the received data for external use
console.log(data);
```

The response will be a JSON array like the one given below.
```json
[
  {
    "_id": "88fc03d8b21030100469b43",
    "name": "Travis Scott",
    "image": "https://example.com/travis.jpg",
    "bio": "A passionate artist from Houston.",
    "genre": "Hip-hop",
    "__v": 0
  }
]
```

You can access each element by looping through the array of objects
```js
data.forEach(artist => {
  console.log("Name:", artist.name);
  console.log("Bio:", artist.bio);
  console.log("Genre:", artist.genre);
  console.log("Image:", artist.image);
});
```

## How to Delete an artist

To delete an artist you have to send a DELETE request to the /library/:id endpoint, where id is the identifier of the artist you want to remove.

``` js
 await fetch(`http://localhost:3000/library/${create_artist_data._id}`, {
    method: 'DELETE'
});
```

If the deletion is successful, the microservice will respond with the 204 status, and if the artist is not found, then it will respond with the 404 status and a JSON object
containing an "Artist not found" message.


# UML Sequence Diagram

<img width="1892" height="703" alt="image" src="https://github.com/user-attachments/assets/be1d3ead-d4e9-4666-b6b2-b10c915fd197" />

# How to run the code locally

1) Navigate to the folder where you want to clone the project  
2) Run: `git clone https://github.com/rrithik/Microservice-A.git`  
3) Run: `cd Microservice-A`  
4) Run: `npm install` to install the requiered dependencies  
5) Configure the `.env` file provided
6) Run: `npm start` to start the server



