import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const adminNav = [
        { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
        { path: '/books', label: 'Books', icon: '📚' },
        { path: '/borrows', label: 'Borrow/Return', icon: '↔' },
        { path: '/members', label: 'Members', icon: '👥' },
        { path: '/staff', label: 'Staff', icon: '👤' },
        { path: '/genres', label: 'Genres', icon: '🏷' },
    ];

    const librarianNav = [
        { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
        { path: '/books', label: 'Books', icon: '📚' },
        { path: '/borrows', label: 'Borrow/Return', icon: '↔' },
    ];

    const navItems = isAdmin ? adminNav : librarianNav;

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-text">Library Manager</span>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                    <div>
                        <p className="user-name">{user.username}</p>
                        <p className="user-role">{user.role}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>↩ Log out</button>
            </div>
        </div>
    );
}

export default Sidebar;