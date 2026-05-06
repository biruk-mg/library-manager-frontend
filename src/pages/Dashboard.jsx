import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Page.css';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ books: 0, members: 0, activeborrows: 0, overdue: 0 });
    const [overdueList, setOverdueList] = useState([]);
    const [popularGenres, setPopularGenres] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [books, members, overdue, summary, genres] = await Promise.all([
                API.get('/books', { headers }),
                API.get('/members', { headers }),
                API.get('/borrow-records/reports/overdue', { headers }),
                API.get('/borrow-records/reports/summary', { headers }),
                API.get('/borrow-records/reports/popular-genres', { headers }),
            ]);
            setStats({
                books: books.data.length,
                members: members.data.length,
                activeborrows: summary.data.totalBorrows || 0,
                overdue: overdue.data.length
            });
            setOverdueList(overdue.data.slice(0, 5));
            setPopularGenres(genres.data.slice(0, 5));
        } catch (error) { console.log('Failed to fetch stats', error); }
    };

    const maxCount = popularGenres.length > 0 ? Math.max(...popularGenres.map(g => g.count || g.total || 0)) : 1;

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header-top">
                    <div>
                        <h1>{isAdmin ? 'Admin Dashboard' : 'Librarian Dashboard'}</h1>
                        <p className="subtitle">{isAdmin ? 'Full system access - Manage all library operations' : 'Standard library operations - Books, members, and borrowing'}</p>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <span className={`badge ${isAdmin ? 'admin-badge' : 'librarian-badge'}`}>
                            {isAdmin ? '🛡 ADMINISTRATOR' : '👤 LIBRARIAN'}
                        </span>
                    </div>
                </div>

                <div className={`role-banner ${isAdmin ? 'admin' : 'librarian'}`}>
                    <span className="role-banner-icon">{isAdmin ? '🛡' : '👤'}</span>
                    <div>
                        <p className="role-banner-title">{isAdmin ? 'Administrator Access' : 'Librarian Access'}</p>
                        <p className="role-banner-desc">
                            {isAdmin
                                ? 'You have full system privileges including delete operations, genre management, and staff administration.'
                                : 'You can manage books and members, handle borrowing operations, and view reports. Contact admin for advanced operations.'}
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <p className="stat-label">Total Books <span>📚</span></p>
                        <p className="stat-number">{stats.books}</p>
                        <p style={{fontSize:'12px', color:'#888'}}>All books in system</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Total Members <span>👥</span></p>
                        <p className="stat-number">{stats.members}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Active Borrows <span>↔</span></p>
                        <p className="stat-number">{stats.activeborrows}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Overdue Books <span>⚠</span></p>
                        <p className="stat-number overdue-num">{stats.overdue}</p>
                    </div>
                </div>

                <div className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <p>{isAdmin ? 'Administrative and library operations' : 'Common library operations'}</p>
                    <div className="actions-grid">
                        <button className="action-card primary-action" onClick={() => navigate('/borrows')}>
                            <span className="action-icon">↔</span>
                            <span>Borrow Book</span>
                        </button>
                        <button className="action-card" onClick={() => navigate('/borrows')}>
                            <span className="action-icon">↩</span>
                            <span>Return Book</span>
                        </button>
                        <button className="action-card" onClick={() => navigate('/members')}>
                            <span className="action-icon">+</span>
                            <span>Add Member</span>
                        </button>
                        <button className="action-card" onClick={() => navigate('/books')}>
                            <span className="action-icon">+</span>
                            <span>Add Book</span>
                        </button>
                        {isAdmin && (
                            <>
                                <button className="action-card" onClick={() => navigate('/genres')}>
                                    <span className="action-icon">🏷</span>
                                    <span>Manage Genres</span>
                                </button>
                                <button className="action-card" onClick={() => navigate('/staff')}>
                                    <span className="action-icon">👤</span>
                                    <span>Admin Reports</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="dashboard-bottom">
                    <div className="dashboard-card">
                        <h2>⚠ Overdue Books</h2>
                        <p className="card-subtitle">Books that are past their due date</p>
                        {overdueList.length === 0 ? (
                            <p className="empty-state">No overdue books!</p>
                        ) : (
                            overdueList.map((record) => (
                                <div key={record.id} className="overdue-item">
                                    <div>
                                        <p className="item-title">{record.book?.title || 'N/A'}</p>
                                        <p className="item-sub">Member: {record.member?.name || 'N/A'}</p>
                                        <p className="item-sub">Due: {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <span className="overdue-badge">Overdue</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="dashboard-card">
                        <h2>📊 Popular Genres</h2>
                        <p className="card-subtitle">Most borrowed book genres</p>
                        {popularGenres.map((genre, index) => (
                            <div key={index} className="genre-item">
                                <span className="genre-rank">#{index + 1}</span>
                                <span className="genre-name">{genre.genre || genre.name || 'N/A'}</span>
                                <div className="genre-bar-wrap">
                                    <div className="genre-bar" style={{width: `${((genre.count || genre.total || 0) / maxCount) * 100}%`}}></div>
                                </div>
                                <span className="genre-count">{genre.count || genre.total || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;