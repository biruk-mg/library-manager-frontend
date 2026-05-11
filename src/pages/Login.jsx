import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../services/api';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

   const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
        const emailMap = {
            'admin': 'admin@library.com',
            'librarian': 'lib@library.com'
        };
        const email = emailMap[username.toLowerCase()] || `${username}@library.com`;
        
        const response = await API.post('/auth/login', {
            email: email,
            password: password
        });
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
    } catch (error) {
        setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
};

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                </div>
                <h1>Library Manager System</h1>
                <p>Sign in to your account to continue</p>

                {error && <div className="error-msg">{error}</div>}

                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                <button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="test-credentials">
                    <p className="cred-title">Test Credentials:</p>
                    <div className="cred-row">
                        <span className="cred-label">Admin:</span>
                        <span className="cred-value">admin / admin123</span>
                    </div>
                    <div className="cred-row">
                        <span className="cred-label">Librarian:</span>
                        <span className="cred-value">librarian / librarian123</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;