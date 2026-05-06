import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Page.css';

function Borrowing() {
    const [borrows, setBorrows] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [newBorrow, setNewBorrow] = useState({ bookId: '', memberId: '', dueDate: '' });

    useEffect(() => {
        fetchBorrows();
        fetchBooks();
        fetchMembers();
    }, []);

    const fetchBorrows = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/borrow-records', { headers });
            setBorrows(response.data);
        } catch (error) { console.log('Failed to fetch borrows', error); }
    };

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/books', { headers });
            setBooks(response.data);
        } catch (error) { console.log('Failed to fetch books', error); }
    };

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/members', { headers });
            setMembers(response.data);
        } catch (error) { console.log('Failed to fetch members', error); }
    };

    const handleBorrow = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/borrow-records/borrow', {
                book_id: parseInt(newBorrow.bookId),
                member_id: parseInt(newBorrow.memberId),
                due_date: newBorrow.dueDate
            }, { headers });
            setShowForm(false);
            setNewBorrow({ bookId: '', memberId: '', dueDate: '' });
            fetchBorrows();
        } catch (error) { console.log('Failed to borrow book', error.response?.data); }
    };

    const handleReturn = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/borrow-records/return', { borrow_record_id: id }, { headers });
            fetchBorrows();
        } catch (error) { console.log('Failed to return book', error.response?.data); }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header-top">
                    <div>
                        <h1>Borrow & Return</h1>
                        <p className="subtitle">Manage book borrowing and return operations</p>
                    </div>
                    <button className="primary-btn" onClick={() => setShowForm(true)}>↔ Borrow Book</button>
                </div>

                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Borrow a Book</h2>
                            <select className="form-input" value={newBorrow.bookId} onChange={(e) => setNewBorrow({...newBorrow, bookId: e.target.value})}>
                                <option value="">Select Book</option>
                                {books.filter(b => b.available_copies > 0).map(book => (
                                    <option key={book.id} value={book.id}>{book.title} (Available: {book.available_copies})</option>
                                ))}
                            </select>
                            <select className="form-input" value={newBorrow.memberId} onChange={(e) => setNewBorrow({...newBorrow, memberId: e.target.value})}>
                                <option value="">Select Member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                            <label style={{fontSize:'13px', color:'#666'}}>Due Date</label>
                            <input type="date" className="form-input" value={newBorrow.dueDate} onChange={(e) => setNewBorrow({...newBorrow, dueDate: e.target.value})} />
                            <div className="modal-actions">
                                <button className="primary-btn" onClick={handleBorrow}>Confirm Borrow</button>
                                <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    {borrows.map((borrow) => (
                        <div key={borrow.id} className="borrow-card">
                            <div className="borrow-card-header">
                                <h3>📖 {borrow.book?.title || 'N/A'}</h3>
                                <span className={`badge ${borrow.return_date ? 'returned-badge' : 'active-badge'}`}>
                                    {borrow.return_date ? 'Returned' : 'Active'}
                                </span>
                            </div>
                            <p className="borrow-member">👤 {borrow.member?.name || 'N/A'}</p>
                            <div className="borrow-dates">
                                <div className="date-item">
                                    <p className="date-label">Borrowed</p>
                                    <p className="date-value">{borrow.borrow_date ? new Date(borrow.borrow_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="date-item">
                                    <p className="date-label">Due</p>
                                    <p className="date-value">{borrow.due_date ? new Date(borrow.due_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                {borrow.return_date && (
                                    <div className="date-item">
                                        <p className="date-label">Returned</p>
                                        <p className="date-value">{new Date(borrow.return_date).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                            {!borrow.return_date && (
                                <button className="return-btn" onClick={() => handleReturn(borrow.id)}>
                                    Mark as Returned
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Borrowing;