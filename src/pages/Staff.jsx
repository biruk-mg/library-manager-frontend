import { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';
import './Page.css';

function Staff() {
    const [staff, setStaff] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newStaff, setNewStaff] = useState({ username: '', email: '', password: '', role: 'librarian' });

    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/auth/users', { headers });
            const data = Array.isArray(response.data) ? response.data : response.data.users || [];
            setStaff(data);
        } catch (error) { console.log(error); }
    };

    const handleAddStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/staff', newStaff, { headers });
            setShowForm(false);
            setNewStaff({ username: '', email: '', password: '', role: 'librarian' });
            fetchStaff();
        } catch (error) { console.log(error.response?.data); }
    };

    const handleDeleteStaff = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.delete(`/staff/${id}`, { headers });
            fetchStaff();
        } catch (error) { console.log(error); }
    };

    const filteredStaff = staff.filter(s =>
        s.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="page-header-top">
                <div>
                    <h1>Staff Management</h1>
                    <p className="subtitle">Manage library staff and administrators (Admin Only)</p>
                </div>
                <button className="primary-btn" onClick={() => setShowForm(true)}>+ Add Staff</button>
            </div>

            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search staff by username, email, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Register New Staff</h2>
                        <input type="text" placeholder="Username" className="form-input" value={newStaff.username} onChange={(e) => setNewStaff({...newStaff, username: e.target.value})} />
                        <input type="email" placeholder="Email" className="form-input" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} />
                        <input type="password" placeholder="Password" className="form-input" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} />
                        <select className="form-input" value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}>
                            <option value="librarian">Librarian</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="modal-actions">
                            <button className="primary-btn" onClick={handleAddStaff}>Save Staff</button>
                            <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="staff-grid">
                {filteredStaff.map((member) => (
                    <div key={member.id} className="staff-card">
                        <div className="staff-card-top">
                            <div className={`staff-avatar ${member.role === 'admin' ? 'admin-avatar' : ''}`}>
                                {member.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                    <p className="staff-name">{member.username}</p>
                                    <span className={`badge ${member.role === 'admin' ? 'admin-badge' : 'librarian-badge'}`}>
                                        {member.role?.toUpperCase()}
                                    </span>
                                </div>
                                <p className="staff-email">{member.email}</p>
                            </div>
                        </div>
                        <div className="staff-details">
                            <p>Role: {member.role}</p>
                        </div>
                        <div className="card-actions">
                            <button className="icon-btn" title="View">👁</button>
                            <button className="icon-btn" title="Edit">✏</button>
                            <button className="icon-btn" onClick={() => handleDeleteStaff(member.id)} title="Delete">🗑</button>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Staff;