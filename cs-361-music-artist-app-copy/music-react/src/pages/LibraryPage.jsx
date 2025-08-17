
import {useEffect, useState} from "react";
import ArtistCard from "../components/ArtistCard";

function LibraryPage() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    // function to edit the results that show in the library to create a new array of artists
    // creates a new array with artists that do not match the id of the artist that is removed
    const removeHandlerLibrary = (id) => {
        setArtists((prevArtists) =>
        {
            const fileteredArtists = prevArtists.filter((artist) => {
                const artistId = artist.id || artist._id;
                return artistId !== id;
            })
            return fileteredArtists;
        })
    }

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await fetch('/api/library');
                if (!response.ok) throw new Error('Failed to fetch artists');
                const data = await response.json();
                setArtists(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    return (
        <div className="library-page">
            <h1>My Library</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="artist-list">
                    {artists.map(artist => (
                        <ArtistCard key={artist.id || artist._id} artist={artist} initialSaved = {true} onRemove = {removeHandlerLibrary}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LibraryPage;