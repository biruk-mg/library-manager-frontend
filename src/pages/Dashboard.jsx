import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Layout from '../components/Layout';
import './Page.css';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ books: 0, members: 0, activeborrows: 0, overdue: 0 });
    const [recentBorrows, setRecentBorrows] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [books, members, overdue, summary, borrows] = await Promise.all([
                API.get('/books', { headers }),
                API.get('/members', { headers }),
                API.get('/borrow-records/reports/overdue', { headers }),
                API.get('/borrow-records/reports/summary', { headers }),
                API.get('/borrow-records', { headers }),
            ]);
            setStats({
                books: books.data.length,
                members: members.data.length,
                activeborrows: summary.data.totalBorrows || 0,
                overdue: overdue.data.length
            });
            setRecentBorrows(borrows.data.slice(0, 5));
        } catch (error) { console.log('Failed to fetch stats', error); }
    };

    return (
        <Layout>
            <div className="page-header-top">
                <div>
                    <h1>{isAdmin ? 'Admin Dashboard' : 'Librarian Dashboard'}
                        <span className={`role-pill ${isAdmin ? 'admin-pill' : 'librarian-pill'}`}>
                            {isAdmin ? '🛡 ADMINISTRATOR' : '👤 LIBRARIAN'}
                        </span>
                    </h1>
                    <p className="subtitle">{isAdmin ? 'Full system access - Manage all library operations' : 'Standard library operations - Books, members, and borrowing'}</p>
                </div>
            </div>

            <div className={`role-banner ${isAdmin ? 'admin-banner' : 'librarian-banner'}`}>
                <span className="banner-icon">{isAdmin ? '🛡' : '👤'}</span>
                <div>
                    <p className="banner-title">{isAdmin ? 'Administrator Access' : 'Librarian Access'}</p>
                    <p className="banner-desc">
                        {isAdmin
                            ? 'You have full system privileges including delete operations, genre management, and staff administration.'
                            : 'You can manage books and members, handle borrowing operations, and view reports. Contact admin for advanced operations.'}
                    </p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-top">
                        <p className="stat-label">Total Books</p>
                        <span className="stat-icon-sm">📚</span>
                    </div>
                    <p className="stat-number">{stats.books}</p>
                    {isAdmin && <p className="stat-sub">All books in system</p>}
                </div>
                <div className="stat-card">
                    <div className="stat-top">
                        <p className="stat-label">Total Members</p>
                        <span className="stat-icon-sm">👥</span>
                    </div>
                    <p className="stat-number">{stats.members}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-top">
                        <p className="stat-label">Active Borrows</p>
                        <span className="stat-icon-sm">↔</span>
                    </div>
                    <p className="stat-number">{stats.activeborrows}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-top">
                        <p className="stat-label">Overdue Books</p>
                        <span className="stat-icon-sm" style={{color:'#A32D2D'}}>⚠</span>
                    </div>
                    <p className="stat-number" style={{color:'#A32D2D'}}>{stats.overdue}</p>
                    {!isAdmin && <p className="stat-sub">Your assigned books</p>}
                </div>
            </div>

            <div className="section-card">
                <h2>Quick Actions</h2>
                <p className="section-subtitle">{isAdmin ? 'Administrative and library operations' : 'Common library operations'}</p>
                <div className="actions-grid">
                    <button className="action-btn black" onClick={() => navigate('/borrows')}>
                        <span>↔</span>
                        <span>Borrow Book</span>
                    </button>
                    <button className="action-btn white" onClick={() => navigate('/borrows')}>
                        <span>↔</span>
                        <span>Return Book</span>
                    </button>
                    <button className="action-btn white" onClick={() => navigate('/members')}>
                        <span>+</span>
                        <span>Add Member</span>
                    </button>
                    <button className="action-btn white" onClick={() => navigate('/books')}>
                        <span>+</span>
                        <span>Add Book</span>
                    </button>
                    {isAdmin && <>
                        <button className="action-btn red-outline" onClick={() => navigate('/genres')}>
                            <span>⚙</span>
                            <span>Manage Genres</span>
                        </button>
                        <button className="action-btn red-outline" onClick={() => navigate('/staff')}>
                            <span>📊</span>
                            <span>Admin Reports</span>
                        </button>
                    </>}
                </div>
            </div>

            <div className="section-card">
                <h2>Recent Activity</h2>
                <p className="section-subtitle">Recent borrow and return operations</p>
                {recentBorrows.map((borrow) => (
                    <div key={borrow.id} className="activity-item">
                        <div className={`activity-dot ${borrow.return_date ? 'green' : 'blue'}`}>↔</div>
                        <div>
                            <p className="activity-title">
                                {borrow.return_date ? 'Returned' : 'Borrowed'}: {borrow.book?.title || 'N/A'}
                            </p>
                            <p className="activity-sub">
                                Member: {borrow.member?.name || 'N/A'} • {borrow.borrow_date ? new Date(borrow.borrow_date).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Dashboard;