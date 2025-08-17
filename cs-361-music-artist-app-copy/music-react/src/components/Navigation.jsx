import {Link} from 'react-router-dom'

function Navigation() {
    return(
        <nav className = "Nav-bar">
            <Link to="/">Home</Link>
            <Link to="/library">My Library</Link>
        </nav>
    )
}

export default Navigation