import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        // YOUR CODE HERE
        // hint: same as Dashboard but GET /books
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="Books">
                <h1>Books</h1>
                // YOUR CODE HERE
                // hint: how do we display the books array?
            </div>
        </div>
    );
}

export default Books;