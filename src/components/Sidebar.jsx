import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="Sidebar">
            <h2>📚 Library</h2>
            <nav>
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button onClick={() => navigate('/books')}>Books</button>
                <button onClick={() => navigate('/members')}>Members</button>
                <button onClick={() => navigate('/borrows')}>Borrowing</button>
                <button onClick={() => navigate('/genres')}>Genres</button>
                <button onClick={() => navigate('/staff')}>Staff</button>
            </nav>
        </div>
    );
}

export default Sidebar;