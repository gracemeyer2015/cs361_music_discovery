import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import SearchBar from '../components/SearchBar'


function SearchHome() {
    const navigate = useNavigate()

    const handleCompletedSearch = ({results, query, error }) => {
        navigate('/search-results', {
            state: {results, query, error}
        })
    }
    
    return (
        <div className = "search-home">
            <div className = "search-home-content">
                <div className = "search-hero">
                    <h1>Search Artists</h1>
                    <p className = "sub-head-text">Discover and catalog your favorite artists</p>
                </div>
                <SearchBar onSearchComplete = {handleCompletedSearch}/>
            </div>

        </div>
    )


}

export default SearchHome