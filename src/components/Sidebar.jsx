import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const adminNav = [
        { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
        { path: '/books', label: 'Books', icon: '📚' },
        { path: '/borrows', label: 'Borrow/Return', icon: '↔' },
        { path: '/members', label: 'Members', icon: '👥' },
        { path: '/staff', label: 'Staff', icon: '👤' },
        { path: '/reports', label: 'Reports', icon: '📊' },
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
        </div>
    );
}

export default Sidebar;