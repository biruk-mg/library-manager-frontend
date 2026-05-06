import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Books.css';

function Staff() {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await API.get('/auth/users', { headers });
        // API might return {users: [...]} instead of [...]
        const data = Array.isArray(response.data) ? response.data : response.data.users || [];
        setStaff(data);
    } catch (error) {
        console.log('Failed to fetch staff', error);
    }
};

    return (
        <div className="layout">
            <Sidebar />
            <div className="page">
                <div className="page-header">
                    <h1>Staff</h1>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.username}</td>
                                    <td>{member.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            background: member.role === 'admin' ? '#EEEDFE' : '#EAF3DE',
                                            color: member.role === 'admin' ? '#3C3489' : '#27500A'
                                        }}>
                                            {member.role}
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

export default Staff;