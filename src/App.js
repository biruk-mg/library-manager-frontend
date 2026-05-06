import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Borrowing from './pages/Borrowing';
import Genres from './pages/Genres';
import Staff from './pages/Staff';

console.log('Login:', Login);
console.log('Dashboard:', Dashboard);
console.log('Books:', Books);
console.log('Members:', Members);
console.log('Borrowing:', Borrowing);
console.log('Genres:', Genres);
console.log('Staff:', Staff); 
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
        <Route path="/genres" element={<Genres />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
