import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Borrowing from './pages/Borrowing';
import Genres from './pages/Genres';
import Staff from './pages/Staff';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
                <Route path="/members" element={<PrivateRoute><Members /></PrivateRoute>} />
                <Route path="/borrows" element={<PrivateRoute><Borrowing /></PrivateRoute>} />
                <Route path="/genres" element={<PrivateRoute><Genres /></PrivateRoute>} />
                <Route path="/staff" element={<PrivateRoute><Staff /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;