import Layout from '../components/Layout';
import './Page.css';

function Profile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <Layout>
            <div className="page-header-top">
                <div>
                    <h1>Profile</h1>
                    <p className="subtitle">View your account information and permissions</p>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">
                    <div className="profile-avatar-circle">
                        <span>👤</span>
                    </div>
                    <h2>{user.username}</h2>
                    <span className={`badge ${user.role === 'admin' ? 'admin-badge' : 'librarian-badge'}`}>
                        {user.role?.toUpperCase()}
                    </span>
                </div>

                <div className="profile-info">
                    <h3>Basic Information</h3>
                    <div className="info-item">
                        <span className="info-icon">👤</span>
                        <div>
                            <p className="info-label">Username</p>
                            <p className="info-value">{user.username}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">✉</span>
                        <div>
                            <p className="info-label">Email Address</p>
                            <p className="info-value">{user.email}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">👤</span>
                        <div>
                            <p className="info-label">Role</p>
                            <p className="info-value" style={{textTransform:'capitalize'}}>{user.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;