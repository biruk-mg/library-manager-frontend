import { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';
import './Page.css';

function Members() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editMember, setEditMember] = useState(null);
    const [history, setHistory] = useState(null);
    const [historyMember, setHistoryMember] = useState('');
    const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', join_date: '' });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/members', { headers });
            setMembers(response.data);
        } catch (error) { console.log(error); }
    };

    const handleAddMember = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/members', newMember, { headers });
            setShowForm(false);
            setNewMember({ name: '', email: '', phone: '', join_date: '' });
            fetchMembers();
        } catch (error) { console.log(error.response?.data); }
    };

    const handleEditMember = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.patch(`/members/${editMember.id}`, {
                name: editMember.name,
                email: editMember.email,
                phone: editMember.phone,
            }, { headers });
            setEditMember(null);
            fetchMembers();
        } catch (error) { console.log(error.response?.data); }
    };

    const handleDeleteMember = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.delete(`/members/${id}`, { headers });
            fetchMembers();
        } catch (error) { console.log(error); }
    };

    const handleViewHistory = async (id, name) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get(`/members/${id}/borrowing-history`, { headers });
            setHistory(response.data);
            setHistoryMember(name);
        } catch (error) { console.log(error); }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="page-header-top">
                <div>
                    <h1>Members</h1>
                    <p className="subtitle">Manage library members</p>
                </div>
                <button className="primary-btn" onClick={() => setShowForm(true)}>+ Add Member</button>
            </div>

            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search members by name, email, or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Register New Member</h2>
                        <input type="text" placeholder="Full Name" className="form-input" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} />
                        <input type="email" placeholder="Email" className="form-input" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} />
                        <input type="text" placeholder="Phone" className="form-input" value={newMember.phone} onChange={(e) => setNewMember({...newMember, phone: e.target.value})} />
                        <input type="date" className="form-input" value={newMember.join_date} onChange={(e) => setNewMember({...newMember, join_date: e.target.value})} />
                        <div className="modal-actions">
                            <button className="primary-btn" onClick={handleAddMember}>Save Member</button>
                            <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {editMember && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Member</h2>
                        <input type="text" placeholder="Full Name" className="form-input" value={editMember.name} onChange={(e) => setEditMember({...editMember, name: e.target.value})} />
                        <input type="email" placeholder="Email" className="form-input" value={editMember.email} onChange={(e) => setEditMember({...editMember, email: e.target.value})} />
                        <input type="text" placeholder="Phone" className="form-input" value={editMember.phone} onChange={(e) => setEditMember({...editMember, phone: e.target.value})} />
                        <div className="modal-actions">
                            <button className="primary-btn" onClick={handleEditMember}>Update Member</button>
                            <button className="secondary-btn" onClick={() => setEditMember(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {history && (
                <div className="modal-overlay">
                    <div className="modal" style={{maxWidth:'600px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h2>Borrowing History — {historyMember}</h2>
                            <button className="secondary-btn" onClick={() => setHistory(null)}>Close</button>
                        </div>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Borrow Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.book?.title || 'N/A'}</td>
                                        <td>{record.borrow_date ? new Date(record.borrow_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>{record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}</td>
                                        <td><span className={`badge ${record.return_date ? 'returned-badge' : 'active-badge'}`}>{record.return_date ? 'Returned' : 'Active'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="members-grid">
                {filteredMembers.map((member) => (
                    <div key={member.id} className="member-card">
                        <div className="member-card-header">
                            <h3>{member.name}</h3>
                        </div>
                        <p className="member-email">{member.email}</p>
                        <div className="member-details">
                            <p>Phone: {member.phone || 'N/A'}</p>
                            <p>Joined: {member.join_date ? new Date(member.join_date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="card-actions">
                            <button className="icon-btn" onClick={() => handleViewHistory(member.id, member.name)} title="History">📋</button>
                            <button className="icon-btn" onClick={() => setEditMember(member)} title="Edit">✏</button>
                            {isAdmin && <button className="icon-btn" onClick={() => handleDeleteMember(member.id)} title="Delete">🗑</button>}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Members;