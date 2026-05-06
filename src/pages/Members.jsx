import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Books.css';

function Members() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/members', { headers });
            setMembers(response.data);
        } catch (error) {
            console.log('Failed to fetch members', error);
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="layout">
            <Sidebar />
            <div className="page">
                <div className="page-header">
                    <h1>Members</h1>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone || 'N/A'}</td>
                                    <td>{member.membershipDate ? new Date(member.membershipDate).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Members;