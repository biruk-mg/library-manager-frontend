import { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import './Page.css';

function Genres() {
    const [genres, setGenres] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editGenre, setEditGenre] = useState(null);
    const [newGenre, setNewGenre] = useState({ name: '' });

    useEffect(() => { fetchGenres(); }, []);

    const fetchGenres = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await API.get('/genres', { headers });
            setGenres(response.data);
        } catch (error) { console.log('Failed to fetch genres', error); }
    };

    const handleAddGenre = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.post('/genres', newGenre, { headers });
            setShowForm(false);
            setNewGenre({ name: '' });
            fetchGenres();
        } catch (error) { console.log('Failed to add genre', error.response?.data); }
    };

    const handleEditGenre = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.patch(`/genres/${editGenre.id}`, { name: editGenre.name }, { headers });
            setEditGenre(null);
            fetchGenres();
        } catch (error) { console.log('Failed to edit genre', error.response?.data); }
    };

    const handleDeleteGenre = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await API.delete(`/genres/${id}`, { headers });
            fetchGenres();
        } catch (error) { console.log('Failed to delete genre', error); }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header-top">
                    <div>
                        <h1>Genres</h1>
                        <p className="subtitle">Manage book genres</p>
                    </div>
                    <button className="primary-btn" onClick={() => setShowForm(true)}>+ Add Genre</button>
                </div>

                {showForm && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Add New Genre</h2>
                            <input type="text" placeholder="Genre Name" className="form-input" value={newGenre.name} onChange={(e) => setNewGenre({ name: e.target.value })} />
                            <div className="modal-actions">
                                <button className="primary-btn" onClick={handleAddGenre}>Save Genre</button>
                                <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {editGenre && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Edit Genre</h2>
                            <input type="text" placeholder="Genre Name" className="form-input" value={editGenre.name} onChange={(e) => setEditGenre({...editGenre, name: e.target.value})} />
                            <div className="modal-actions">
                                <button className="primary-btn" onClick={handleEditGenre}>Update Genre</button>
                                <button className="secondary-btn" onClick={() => setEditGenre(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="genres-grid">
                    {genres.map((genre) => (
                        <div key={genre.id} className="genre-card">
                            <div className="genre-card-info">
                                <h3>{genre.name}</h3>
                                <p>Genre ID: {genre.id}</p>
                            </div>
                            <div className="card-actions" style={{borderTop:'none', paddingTop:0}}>
                                <button className="icon-btn edit" onClick={() => setEditGenre(genre)} title="Edit">✏</button>
                                <button className="icon-btn delete" onClick={() => handleDeleteGenre(genre.id)} title="Delete">🗑</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Genres;