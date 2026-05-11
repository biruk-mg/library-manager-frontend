import { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';
import './Page.css';

function Borrowing() {
    const [borrows, setBorrows] = useState([]);
    const [showBorrowForm, setShowBorrowForm] = useState(false);
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
        } catch (error) { console.log(error); }
    };

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/members', { headers });
            setMembers(response.data);
        } catch (error) { console.log(error); }
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
            setShowBorrowForm(false);
            setNewBorrow({ bookId: '', memberId: '', dueDate: '' });
            fetchBorrows();
        } catch (error) { console.log('Failed to borrow', error.response?.data); }
    };

    const handleReturn = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/borrow-records/return', { borrow_record_id: id }, { headers });
            fetchBorrows();
        } catch (error) { console.log('Failed to return', error.response?.data); }
    };

    const getStatus = (borrow) => {
        if (borrow.return_date) return 'returned';
        if (new Date(borrow.due_date) < new Date()) return 'overdue';
        return 'active';
    };

    return (
        <Layout>
            <div className="page-header-top">
                <div>
                    <h1>Borrow & Return</h1>
                    <p className="subtitle">Manage book borrowing and return operations</p>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                    <button className="primary-btn" onClick={() => setShowBorrowForm(true)}>↔ Borrow Book</button>
                    <button className="secondary-btn">↔ Return Book</button>
                </div>
            </div>

            {showBorrowForm && (
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
                            <button className="secondary-btn" onClick={() => setShowBorrowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                {borrows.map((borrow) => {
                    const status = getStatus(borrow);
                    return (
                        <div key={borrow.id} className="borrow-card">
                            <div className="borrow-card-header">
                                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                    <span style={{fontSize:'16px'}}>📖</span>
                                    <h3>{borrow.book?.title || 'N/A'}</h3>
                                </div>
                                {status === 'active' && <span className="status-badge active-status">ACTIVE</span>}
                                {status === 'returned' && <span className="status-text">RETURNED</span>}
                                {status === 'overdue' && <span className="status-badge overdue-status">OVERDUE</span>}
                            </div>
                            <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'12px'}}>
                                <span style={{fontSize:'13px'}}>👤</span>
                                <p className="borrow-member">{borrow.member?.name || 'N/A'}</p>
                            </div>
                            <div className="borrow-dates">
                                <div className="date-item">
                                    <span style={{fontSize:'13px'}}>📅</span>
                                    <div>
                                        <p className="date-label">Borrowed:</p>
                                        <p className="date-value">{borrow.borrow_date ? new Date(borrow.borrow_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="date-item">
                                    <span style={{fontSize:'13px'}}>📅</span>
                                    <div>
                                        <p className="date-label">Due:</p>
                                        <p className="date-value">{borrow.due_date ? new Date(borrow.due_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                                {borrow.return_date && (
                                    <div className="date-item">
                                        <span style={{fontSize:'13px'}}>📅</span>
                                        <div>
                                            <p className="date-label">Returned:</p>
                                            <p className="date-value">{new Date(borrow.return_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {status !== 'returned' && (
                                <button className="mark-returned-btn" onClick={() => handleReturn(borrow.id)}>
                                    Mark as Returned
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}

export default Borrowing;