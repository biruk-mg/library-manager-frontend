import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Books.css';

function Borrowing() {
    const [borrows, setBorrows] = useState([]);

    useEffect(() => {
        fetchBorrows();
    }, []);

    const fetchBorrows = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/borrow-records', { headers });
            setBorrows(response.data);
        } catch (error) {
            console.log('Failed to fetch borrows', error);
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="page">
                <div className="page-header">
                    <h1>Borrowing Records</h1>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Member</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map((borrow) => (
                                <tr key={borrow.id}>
                                    <td>{borrow.book?.title || 'N/A'}</td>
                                    <td>{borrow.member?.name || 'N/A'}</td>
                                    <td>{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            background: borrow.returnDate ? '#EAF3DE' : '#FCEBEB',
                                            color: borrow.returnDate ? '#27500A' : '#791F1F'
                                        }}>
                                            {borrow.returnDate ? 'Returned' : 'Active'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Borrowing;