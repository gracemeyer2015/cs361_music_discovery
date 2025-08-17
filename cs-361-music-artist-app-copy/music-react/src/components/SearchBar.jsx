import {useState} from "react";
import { FaSearch } from "react-icons/fa";
import { ImSpinner2} from "react-icons/im"


function SearchBar({onSearchComplete}){
    const[query, setQuery] = useState("")
    const[loading, setLoading] = useState(false)
    const[focused, setFocused] = useState(false)

    const searchHandler = async (e) => {
        e.preventDefault()
        const trimQuery = query.trim()

        if(!trimQuery) return;
        
        setLoading(true)

        try {
           const res = await fetch(
            `/api/artists/search?q=${encodeURIComponent(trimQuery)}`)

            if (!res.ok) throw new Error(`http error: ${res.status}`)
            const data = await res.json()

            onSearchComplete?.({
                results: data.artists || [],
                query: trimQuery,
                error: null
            }) } catch(err) {
                console.error('API:', err)
                onSearchComplete?.({
                    results: [],
                    query: trimQuery,
                    error: 'Artist not found'
                })

            } finally {
                setLoading(false)
            }}
    return(
        <form className = "search-bar" onSubmit = {searchHandler}>
            
            <div className ={`search-input ${focused? "focused":" " }`}>
                
                {loading? (<ImSpinner2 className = "searchIcon animate-spin" />):(!focused && <FaSearch className = "searchIcon"/>)}
                <input
                type = "text"
                value = {query}
                onChange = { (e) => setQuery(e.target.value)}
                onFocus = {() => setFocused(true)}
                onBlur = {() => setFocused(false)}
                placeholder="Search for an artist"
                className = "search-input"
                disabled = {loading}
                />
              </div>    
        </form>

    )
}


export default SearchBar