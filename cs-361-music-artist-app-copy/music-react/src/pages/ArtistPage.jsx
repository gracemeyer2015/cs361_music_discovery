import { useEffect, useState } from 'react';
import {useParams, useLocation} from 'react-router-dom';
import FindSimilarArtistButton from '../components/FindSimilarArtistButton';


function ArtistPage() {
    const { name } = useParams();
    const location = useLocation();
    const passed = location.state?.artist || null

    const [artist, setArtist] = useState(passed || null);
    const [loading, setLoading] = useState(!passed);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (artist && artist.name === name) return
        const fetchArtist = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/artist/${encodeURIComponent(name)}/info`);
                if (!response.ok) throw new Error('Failed to fetch artist');
                const data = await response.json();
                setArtist(data);
            } catch (err) {
                console.error(err);
                setError('Could not fetch artist details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchArtist();
    }, [name]);

    if (loading) return <div>Loading artist details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!artist) return <div>No artist found</div>;

     const imageSrc =
        artist.imageBase64 && artist.imageBase64.startsWith("data:")
            ? artist.imageBase64
            : artist.imageBase64
            ? `data:image/jpeg;base64,${artist.imageBase64}`
            : null;


    return (
        <div className="artist-page">
            <div className="artist-header">
                {imageSrc ? (
                    <img src={imageSrc} alt ={`${artist.name} image`} className ="artist-page-image"/>
                ) : null}
                <div className = "artist-info">
                    <h1>{artist.name}</h1>
                    <p className="artist-genre">{artist.genre}</p>
                    <section className="artist-bio">
                        <h3>Bio: </h3>
                        <div dangerouslySetInnerHTML={{ __html: artist.bio || "<p>No bio</p>" }}/>
                    </section>
                </div>
            </div> 
            
        </div>
    );
}

export default ArtistPage;
