import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="header">
            <span className="header-logo">Library Manager</span>
            <div className="header-right">
                <span className="welcome-text">Welcome, {user.username}</span>
                <div className="avatar" onClick={() => setShowDropdown(!showDropdown)}>
                    {user.username?.charAt(0).toUpperCase()}
                </div>
                {showDropdown && (
                    <div className="dropdown">
                        <div className="dropdown-user">
                            <p className="dropdown-username">{user.username}</p>
                            <p className="dropdown-role">{user.role}</p>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={() => { navigate('/profile'); setShowDropdown(false); }}>
                            <span>👤</span> Profile
                        </button>
                        <button className="dropdown-item logout" onClick={handleLogout}>
                            <span>↩</span> Log out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;