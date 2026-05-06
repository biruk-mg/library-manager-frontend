import { useNavigate } from "react-router-dom";
import { useState } from "react";  
import API from "../services/api";
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
        <div className="Login">
            <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
export default Login;
