import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Borrowing from './pages/Borrowing';

console.log('Login:', Login);
console.log('Dashboard:', Dashboard);
console.log('Books:', Books);
console.log('Members:', Members);
console.log('Borrowing:', Borrowing);
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/borrows" element={<Borrowing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
