import { useState, useEffect } from 'react';
import API from '../services/api';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';
function Dashboard() {
    const [stats, setStats] = useState({
        books: 0,
        members: 0,
        activeborrows: 0,
        overdue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const books = await API.get('/books', { headers });
            const members = await API.get('/members', { headers });
            const overdue = await API.get('/borrow-records/reports/overdue', { headers });

            setStats({
                books: books.data.length,
                members: members.data.length,
                activeborrows: overdue.data.length,
                overdue: overdue.data.length
            });
        } catch (error) {
            console.log('Failed to fetch stats', error);
        }
    };

    return (
        <div className="layout">
                <Sidebar />
        <div className="Dashboard">
            <h1>Dashboard</h1>
            <div className="stats">
                <div className="stat-card">
                    <h3>Total Books</h3>
                    <p>{stats.books}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Members</h3>
                    <p>{stats.members}</p>
                </div>
                <div className="stat-card">
                    <h3>Overdue Books</h3>
                    <p>{stats.overdue}</p>
                </div>
            </div>
        </div>
        </div>
            
);
}

export default Dashboard;