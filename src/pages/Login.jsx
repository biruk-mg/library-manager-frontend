import { useNavigate } from "react-router-dom";
import { useState } from "react";  
import API from "../services/api";
import './Login.css';
function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

   const handleLogin = async () => {
    try {
        const response = await API.post ('/auth/login', {
            email:email,
            password:password
        });
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
} catch(error) {
    console.log('Login failed', error);
}
   };

    return (
    <div className="login-container">
        <div className="login-box">
            <h1>📚 Library</h1>
            <p>Sign in to your account</p>
            <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Sign In</button>
        </div>
    </div>
);
}
export default Login;
