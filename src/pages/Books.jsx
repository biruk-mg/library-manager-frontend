import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Books.css';

function Books() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []); 

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/books', { headers });
            setBooks(response.data);
        } catch (error) {
            console.log('Failed to fetch books', error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase())
    );

    const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    published_year: 2024,
    available_copies: 1,
    genre_id: 1
});

    const handleAddBook = async () => {
    console.log('Trying to add:', newBook); // ← add this
    try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await API.post('/books', newBook, { headers });
        console.log('Response:', response); // ← add this
        setShowForm(false);
        setNewBook({ title: '', author: '', totalCopies: 1 });
        fetchBooks();
    } catch (error) {
        console.log('Failed to add book', error); // ← already here
    }
};
    const handleDeleteBook = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await API.delete(`/books/${id}`, { headers });
        fetchBooks(); // refresh list
    } catch (error) {
        console.log('Failed to delete book', error);
    }
};
    return (
        <div className="layout">
            <Sidebar />
            <div className="page">
                <div className="page-header">
                    <h1>Books</h1>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button className="add-btn" onClick={() => setShowForm(true)}> 
                        + Add Book 
                    </button>
                </div>

                {showForm && (
    <div className="form-container">
        <h2>Add New Book</h2>
        <input 
            type="text" 
            placeholder="Title" 
            className="form-input"
            value={newBook.title}
            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
        />
        <input 
            type="text" 
            placeholder="Author" 
            className="form-input"
            value={newBook.author}
            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
        />
        <input 
            type="number" 
            placeholder="Published Year" 
            className="form-input"
            value={newBook.published_year}
            onChange={(e) => setNewBook({...newBook, published_year: parseInt(e.target.value)})}
        />
        <input 
            type="number" 
            placeholder="Available Copies" 
            className="form-input"
            value={newBook.available_copies}
            onChange={(e) => setNewBook({...newBook, available_copies: parseInt(e.target.value)})}
        />
        <input 
            type="number" 
            placeholder="Genre ID" 
            className="form-input"
            value={newBook.genre_id}
            onChange={(e) => setNewBook({...newBook, genre_id: parseInt(e.target.value)})}
        />
        <div className="form-buttons">
            <button className="add-btn" onClick={handleAddBook}>Save</button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
    </div>
)}
<tbody>
    {filteredBooks.map((book) => (
        <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.genre?.name || 'N/A'}</td>
            <td>{book.totalCopies}</td>
            <td>{book.availableCopies}</td>
            <td>
                <button 
                    onClick={() => handleDeleteBook(book.id)}
                    style={{
                        background: '#FCEBEB',
                        color: '#791F1F',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Delete
                </button>
            </td>
        </tr>
    ))}
</tbody>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Copies</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre?.name || 'N/A'}</td>
                                    <td>{book.totalCopies}</td>
                                    <td>{book.availableCopies}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Books;