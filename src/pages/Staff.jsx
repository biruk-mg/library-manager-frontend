import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Page.css';

function Staff() {
    const [staff, setStaff] = useState([]);
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
        } catch (error) { console.log('Failed to fetch staff', error); }
    };

    const handleAddStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/staff', newStaff, { headers });
            setShowForm(false);
            setNewStaff({ username: '', email: '', password: '', role: 'librarian' });
            fetchStaff();
        } catch (error) { console.log('Failed to add staff', error.response?.data); }
    };

    const handleDeleteStaff = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.delete(`/staff/${id}`, { headers });
            fetchStaff();
        } catch (error) { console.log('Failed to delete staff', error); }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header-top">
                    <div>
                        <h1>Staff Management</h1>
                        <p className="subtitle">Manage library staff accounts</p>
                    </div>
                    <button className="primary-btn" onClick={() => setShowForm(true)}>+ Add Staff</button>
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
                    {staff.map((member) => (
                        <div key={member.id} className="staff-card">
                            <div className="staff-avatar">
                                {member.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="staff-card-header">
                                <h3 className="staff-name">{member.username}</h3>
                                <span className={`badge ${member.role === 'admin' ? 'admin-badge' : 'librarian-badge'}`}>
                                    {member.role?.toUpperCase()}
                                </span>
                            </div>
                            <p className="staff-email">{member.email}</p>
                            <div className="staff-details">
                                <p>Role: {member.role}</p>
                            </div>
                            <div className="card-actions">
                                <button className="icon-btn delete" onClick={() => handleDeleteStaff(member.id)} title="Delete">🗑</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Staff;