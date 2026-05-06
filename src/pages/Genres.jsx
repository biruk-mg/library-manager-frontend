import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Books.css';

function Genres() {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/genres', { headers });
            setGenres(response.data);
        } catch (error) {
            console.log('Failed to fetch genres', error);
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="page">
                <div className="page-header">
                    <h1>Genres</h1>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres.map((genre) => (
                                <tr key={genre.id}>
                                    <td>{genre.id}</td>
                                    <td>{genre.name}</td>
                                    <td>{genre.description || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Genres;