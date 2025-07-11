import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import StarRating from '../components/StarRating';



const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState({ name: '', address: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });



  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: query
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
    axios.get('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => setName(res.data.name));

  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRatingChange = async (storeId, value) => {
    try {
      await axios.post(
        'http://localhost:5000/api/user/rate',
        { store_id: storeId, rating: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Rating submitted successfully!');
      fetchStores(); // refresh list
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to submit rating');
    }
  };

    const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/api/user/update-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setPasswordMsg("✅ Password updated!");
        setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
        setPasswordMsg(err.response?.data?.error || "❌ Failed to update password");
    }
    };



  return (
            <>
        <Header role="user" name={name} onPasswordClick={() => setShowPasswordModal(true)}/>
        <div className="container mt-4">
            <div className="container mt-5">
            <h2 className="text-center mb-4">🏬 All Stores</h2>

            <form className="row g-3 mb-4" onSubmit={handleSearch}>
                <div className="col-md-5">
                <input
                    className="form-control"
                    placeholder="Search by name"
                    onChange={(e) => setQuery({ ...query, name: e.target.value })}
                />
                </div>
                <div className="col-md-5">
                <input
                    className="form-control"
                    placeholder="Search by address"
                    onChange={(e) => setQuery({ ...query, address: e.target.value })}
                />
                </div>
                <div className="col-md-2 d-grid">
                <button className="btn btn-primary">Search</button>
                </div>
            </form>

            {message && <div className="alert alert-info">{message}</div>}

            {stores.length === 0 && <p>No stores found.</p>}

            {stores.map((store) => (
                <div key={store.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">{store.name}</h5>
                    <p className="card-text">{store.address}</p>
                    <p>
                    ⭐ <strong>Average Rating:</strong> {store.average_rating || 'No ratings yet'}
                    <br />
                    📝 <strong>Your Rating:</strong>{' '}
                    {store.user_rating ? (
                        <span className="text-success">{store.user_rating}</span>
                    ) : (
                        <span className="text-muted">None</span>
                    )}
                    </p>
                    <div className="input-group mt-2" style={{ maxWidth: '180px' }}>
                        <p>Submit Your Rating</p>
                        <StarRating
                        rating={store.user_rating || 0}
                        onChange={(value) => handleRatingChange(store.id, value)}
                        />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

            {showPasswordModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title">🔑 Change Password</h5>
                        <button className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                        </div>
                        <div className="modal-body">
                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-3">
                            <label>Old Password</label>
                            <input type="password" className="form-control" value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                            <label>New Password</label>
                            <input type="password" className="form-control" value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                            </div>
                            <button className="btn btn-warning w-100" type="submit">Update Password</button>
                        </form>
                        {passwordMsg && <div className="alert alert-info mt-3">{passwordMsg}</div>}
                        </div>
                        <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Close</button>
                        </div>
                    </div>
                    </div>
                </div>
                )}

        </>
  );
};

export default UserDashboard;
