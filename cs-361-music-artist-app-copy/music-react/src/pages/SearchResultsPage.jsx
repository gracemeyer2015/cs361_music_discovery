import { useLocation, useNavigate} from 'react-router-dom'
import ArtistCard from '../components/ArtistCard'

function SearchResultsPage() {
    const location = useLocation()
    const navigate = useNavigate()

    const { results = [], query = '', error = null } = location.state || {}

    if(!location.state){
        navigate('/')
        return null
    }
    return (
        <div className = "search-results-page">
            <h1>Search results for "{query}"</h1>
            { error && <p className = "error-message">{error}</p>}

            {results.length === 0 && !error && (<p>No artists found</p>)}
       
            <div className = "artist-card-list">
            {results.map((artist)=> (
                <ArtistCard key = {artist.name} artist = {artist}/>
            ))}

            </div>
        </div>
    )
}

export default SearchResultsPage