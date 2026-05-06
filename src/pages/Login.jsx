import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../services/api';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await API.post('/auth/login', {
                email: email,
                password: password
            });
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            setError('Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">📖</div>
                <h1>Library Manager System</h1>
                <p>Sign in to your account to continue</p>
                {error && <div className="error-msg">{error}</div>}
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </div>
        </div>
    );
}

export default Login;