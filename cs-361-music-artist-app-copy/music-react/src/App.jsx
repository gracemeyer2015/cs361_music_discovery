
import SearchHome from './pages/SearchHome.jsx'
import SearchResultsPage from './pages/SearchResultsPage.jsx'
import Navigation from './components/Navigation.jsx'
import LibraryPage from './pages/LibraryPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArtistPage from './pages/ArtistPage.jsx'
import './App.css'


function App() {
 

  return (
      <BrowserRouter>
        <Navigation/>
        <div className = "app">
          <Routes>
            <Route path = "/" element = {<SearchHome/>}/>
            <Route path="/search-results" element = {<SearchResultsPage/>}/>
            <Route path="/artist/:name" element= {<ArtistPage/>}/>
            <Route path="/library" element = {<LibraryPage/>}/>
            <Route path="/artist/:name" element = {<ArtistPage/>}/>
          </Routes>
        </div>
      </BrowserRouter>
   
  )
}

export default App
