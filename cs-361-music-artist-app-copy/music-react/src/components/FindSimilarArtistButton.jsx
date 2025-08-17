import {useState} from 'react';
import {Link} from 'react-router-dom';


function FindSimilarArtistButton({artistName}) {
    const [similarArtists, setSimilarArtists] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const fetchSimilarArtists = async () => {

        if (expanded){
            setExpanded(false);
            return;
        }
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`/api/similar?artist=${encodeURIComponent(artistName)}`);
            if(!response.ok) {
               throw new Error(`Error fetching similar artists: ${response.status}`)
            }

            const responseData = await response.json();
            setSimilarArtists(responseData.similarArtists || []);
            setExpanded(true);
            
        }catch(err){
            console.error(err);
            setError("Could not fetch similar artists. Please try again later.");
        } finally {
            setLoading(false);
        }

    }; 

    return (
        <div className = "similar-button-wrapper">
            <button className = "similar-button" 
            onClick={fetchSimilarArtists}
            disabled = {loading}>
                {loading ? "Loading..." : expanded ? "Hide similar artists": "Find Similar Artists"}
            </button>

            {error && <p className="error-message">{error}</p>}

            {expanded && similarArtists.length > 0 && (
                <div className="similar-artists-list">
                    <h3>Similar Artists</h3>
                    <div className = "artist-list">
                        {similarArtists.map(((artist, index) =>
                        (
                            <div key = {index} className = "similar-artist-item">
                                <Link to={`/artist/${encodeURIComponent(artist.name)}`}
                                    state={{ artist }}
                                    onClick={() => setExpanded(false)}
                                 className="similar-artist-link">
                                    <p>{artist.name}</p>
                                </Link>
                            </div>
                        )))}
                    </div>
                </div>
            )}
            { expanded && !loading && similarArtists.length === 0 && !error &&
            (<p>No similar artists found</p>)}

        </div>
        )
    }

export default FindSimilarArtistButton;