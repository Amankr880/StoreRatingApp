import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');

  useEffect(() => {
    axios
    .get('http://localhost:5000/api/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setName(res.data.name));

    axios
      .get('http://localhost:5000/api/store-owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setStoreData(res.data.store))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load store data'));
  }, [token]);

  return (
    <>
      <Header role="store_owner" name = {name}/>
      <div className="container mt-4">
        <h2 className="mb-4 text-center">🏪 Store Owner Dashboard</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {storeData && (
          <div className="card shadow-sm p-4">
            <h4>{storeData.name}</h4>
            <p className="mb-2">⭐ Average Rating: <strong>{storeData.average_rating || 'No ratings yet'}</strong></p>

            <h5 className="mt-4">📋 Ratings from Users</h5>
            {storeData.ratings.length === 0 ? (
              <p>No ratings yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover mt-2">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeData.ratings.map((r, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{r.user_name}</td>
                        <td>{r.email}</td>
                        <td>⭐ {r.rating}</td>
                        <td>{new Date(r.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StoreOwnerDashboard;
