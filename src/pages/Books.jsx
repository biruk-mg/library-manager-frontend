import { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';
import './Page.css';

function Books() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [newBook, setNewBook] = useState({ title: '', author: '', published_year: 2024, available_copies: 1, genre_id: 1 });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    useEffect(() => { fetchBooks(); }, []);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/books', { headers });
            setBooks(response.data);
        } catch (error) { console.log('Failed to fetch books', error); }
    };

    const handleAddBook = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/books', newBook, { headers });
            setShowForm(false);
            setNewBook({ title: '', author: '', published_year: 2024, available_copies: 1, genre_id: 1 });
            fetchBooks();
        } catch (error) { console.log('Failed to add book', error.response?.data); }
    };

    const handleEditBook = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.patch(`/books/${editBook.id}`, {
                title: editBook.title,
                author: editBook.author,
                published_year: editBook.published_year,
                available_copies: editBook.available_copies,
            }, { headers });
            setEditBook(null);
            fetchBooks();
        } catch (error) { console.log('Failed to edit book', error.response?.data); }
    };

    const handleDeleteBook = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.delete(`/books/${id}`, { headers });
            fetchBooks();
        } catch (error) { console.log('Failed to delete book', error); }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="page-header-top">
                <div>
                    <h1>Books</h1>
                    <p className="subtitle">Manage your library's book collection</p>
                </div>
                <button className="primary-btn" onClick={() => setShowForm(true)}>+ Add Book</button>
            </div>

            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search books by title, author, or genre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Book</h2>
                        <input type="text" placeholder="Title" className="form-input" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
                        <input type="text" placeholder="Author" className="form-input" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} />
                        <input type="number" placeholder="Published Year" className="form-input" value={newBook.published_year} onChange={(e) => setNewBook({...newBook, published_year: parseInt(e.target.value)})} />
                        <input type="number" placeholder="Available Copies" className="form-input" value={newBook.available_copies} onChange={(e) => setNewBook({...newBook, available_copies: parseInt(e.target.value)})} />
                        <input type="number" placeholder="Genre ID" className="form-input" value={newBook.genre_id} onChange={(e) => setNewBook({...newBook, genre_id: parseInt(e.target.value)})} />
                        <div className="modal-actions">
                            <button className="primary-btn" onClick={handleAddBook}>Save Book</button>
                            <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {editBook && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Book</h2>
                        <input type="text" placeholder="Title" className="form-input" value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})} />
                        <input type="text" placeholder="Author" className="form-input" value={editBook.author} onChange={(e) => setEditBook({...editBook, author: e.target.value})} />
                        <input type="number" placeholder="Published Year" className="form-input" value={editBook.published_year} onChange={(e) => setEditBook({...editBook, published_year: parseInt(e.target.value)})} />
                        <input type="number" placeholder="Available Copies" className="form-input" value={editBook.available_copies} onChange={(e) => setEditBook({...editBook, available_copies: parseInt(e.target.value)})} />
                        <div className="modal-actions">
                            <button className="primary-btn" onClick={handleEditBook}>Update Book</button>
                            <button className="secondary-btn" onClick={() => setEditBook(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card-grid">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="book-card">
                        <div className="book-card-header">
                            <h3>{book.title}</h3>
                            <span className={`badge ${book.available_copies > 0 ? 'available-badge' : 'outofstock-badge'}`}>
                                {book.available_copies > 0 ? 'Available' : 'Out of Stock'}
                            </span>
                        </div>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-details">
                            <p>Genre: {book.genre?.name || 'N/A'}</p>
                            <p>Published: {book.published_year || 'N/A'}</p>
                            <p>Available Copies: {book.available_copies}</p>
                        </div>
                        <div className="card-actions">
                            <button className="icon-btn" title="View">👁</button>
                            <button className="icon-btn" onClick={() => setEditBook(book)} title="Edit">✏</button>
                            {isAdmin && (
                                <button className="icon-btn" onClick={() => handleDeleteBook(book.id)} title="Delete">🗑</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Books;