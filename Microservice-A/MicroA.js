import fetch from 'node-fetch';

const artist={
    name: "Travis Scott",
    bio: "A passionate artist",
    image: "https://example.com/image.jpg",
    genre: "hip-hop"
};

const create_artist_response = await fetch('http://localhost:3000/library', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(artist)
});

const artist1={
    name: "Pop Smoke",
    bio: "A passionate artist",
    image: "https://example.com/image.jpg",
    genre: "hip-hop"
};

await fetch('http://localhost:3000/library', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(artist1)
});

const create_artist_data = await create_artist_response.json();
console.log('Create Artist Response:', create_artist_data);

const get_artists_response = await fetch('http://localhost:3000/library');
const get_artists_data = await get_artists_response.json();
console.log('Get Artists Response:', get_artists_data);

const delete_artist_response = await fetch(`http://localhost:3000/library/${create_artist_data._id}`, {
    method: 'DELETE'
});
if (delete_artist_response.ok) {
    console.log('Artist deleted successfully');
}
else {
    const delete_artist_error = await delete_artist_response.json();
    console.error('Delete Artist Error:', delete_artist_error);
}
