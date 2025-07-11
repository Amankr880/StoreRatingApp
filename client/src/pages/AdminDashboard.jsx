import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [storeList, setStoreList] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });




  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch all store owners for dropdown
    axios
      .get('http://localhost:5000/api/admin/users?role=store_owner', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setOwners(res.data))
      .catch(() => setOwners([]));
  }, [token]);

  const handleUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleStoreChange = (e) => setStoreForm({ ...storeForm, [e.target.name]: e.target.value });

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/create-user', userForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ User created successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to create user');
    }
  };

  const submitStore = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/create-store', storeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Store created successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to create store');
    }
  };

  const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
            params: userFilters
            });
            setUserList(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
        };

        useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleViewUser = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(res.data);
            setShowUserModal(true);
        } catch (err) {
            console.error("Failed to load user details", err);
        }
    };


    const fetchStores = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stores', {
            headers: { Authorization: `Bearer ${token}` },
            params: storeFilters
            });
            setStoreList(res.data);
        } catch (err) {
            console.error('Failed to fetch stores', err);
        }
        };

        useEffect(() => {
        fetchStores();
        }, [token]);




  return (

                <>
        <Header role="admin" />
        <div className="container mt-4">
            <div className="container mt-5">
            <h2 className="text-center mb-4">🛠 Admin Dashboard</h2>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    ➕ Create User
                </button>
                </li>
                <li className="nav-item">
                <button className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>
                    🏪 Create Store
                </button>
                </li>
                <li className="nav-item">
                <button className={`nav-link ${activeTab === 'manage_users' ? 'active' : ''}`} onClick={() => setActiveTab('manage_users')}>
                    👥 Manage Users
                </button>
                </li>
                <li className="nav-item">
                <button className={`nav-link ${activeTab === 'manage_stores' ? 'active' : ''}`} onClick={() => setActiveTab('manage_stores')}>
                    🏪 Manage Stores
                </button>
                </li>

            </ul>

            {activeTab === 'users' && (
                <div className="card p-4 shadow-sm">
                <h4 className="mb-3">➕ Create New User</h4>
                <form onSubmit={submitUser}>
                    <div className="mb-3">
                    <label>Name</label>
                    <input className="form-control" name="name" onChange={handleUserChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" name="email" type="email" onChange={handleUserChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Address</label>
                    <input className="form-control" name="address" onChange={handleUserChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Password</label>
                    <input className="form-control" name="password" type="password" onChange={handleUserChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Role</label>
                    <select className="form-select" name="role" onChange={handleUserChange} value={userForm.role}>
                        <option value="user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                    </div>
                    <button className="btn btn-primary w-100">Create User</button>
                </form>
                </div>
            )}

            {activeTab === 'stores' && (
                <div className="card p-4 shadow-sm">
                <h4 className="mb-3">🏪 Create New Store</h4>
                <form onSubmit={submitStore}>
                    <div className="mb-3">
                    <label>Store Name</label>
                    <input className="form-control" name="name" onChange={handleStoreChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" name="email" type="email" onChange={handleStoreChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Address</label>
                    <input className="form-control" name="address" onChange={handleStoreChange} required />
                    </div>
                    <div className="mb-3">
                    <label>Store Owner</label>
                    <select className="form-select" name="owner_id" onChange={handleStoreChange} required>
                        <option value="">Select Owner</option>
                        {/* {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>{owner.name}</option>
                        ))} */}
                        {owners.map((owner, index) => (
                            <option key={owner.id} value={owner.id}>
                                {index + 1}. {owner.name}
                            </option>
                            ))}
                    </select>
                    </div>
                    <button className="btn btn-success w-100">Create Store</button>
                </form>
                </div>
            )}

            {activeTab === 'manage_users' && (
                <div className="card p-4 shadow-sm">
                    <h4 className="mb-3">👥 User List</h4>

                    {/* Table filters */}
                    <form className="row g-3 mb-3" onSubmit={(e) => { e.preventDefault(); fetchUsers(); }}>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Name" onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Email" onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                        <input className="form-control" placeholder="Address" onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}>
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">Normal User</option>
                        <option value="store_owner">Store Owner</option>
                        </select>
                    </div>
                    <div className="col-md-12">
                        <button className="btn btn-primary w-100">Apply Filters</button>
                    </div>
                    </form>

                    {/* User Table */}
                    <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userList.map((user, idx) => (
                            <tr key={user.id}>
                            <td>{idx + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleViewUser(user.id)}
                                >
                                View
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}

            {activeTab === 'manage_stores' && (
                <div className="card p-4 shadow-sm">
                    <h4 className="mb-3">🏪 Store List</h4>

                    {/* Store Filters */}
                    <form className="row g-3 mb-3" onSubmit={(e) => { e.preventDefault(); fetchStores(); }}>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Store Name" onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Email" onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Address" onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })} />
                    </div>
                    <div className="col-md-12">
                        <button className="btn btn-success w-100">Apply Filters</button>
                    </div>
                    </form>

                    {/* Store Table */}
                    <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Store Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Average Rating</th>
                        </tr>
                        </thead>
                        <tbody>
                        {storeList.map((store, idx) => (
                            <tr key={store.id}>
                            <td>{idx + 1}</td>
                            <td>{store.name}</td>
                            <td>{store.email}</td>
                            <td>{store.address}</td>
                            <td>⭐ {store.average_rating || 'No ratings yet'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                )}


            {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>


        {showUserModal && selectedUser && (
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">👤 User Details</h5>
                    <button type="button" className="btn-close" onClick={() => setShowUserModal(false)}></button>
                    </div>
                    <div className="modal-body">
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Address:</strong> {selectedUser.address}</p>
                    <p><strong>Role:</strong> {selectedUser.role}</p>

                    {selectedUser.role === 'store_owner' && (
                        <p><strong>Average Store Rating:</strong> ⭐ {selectedUser.average_rating || 'No ratings yet'}</p>
                    )}
                    </div>
                    <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                        Close
                    </button>
                    </div>
                </div>
                </div>
            </div>
        )}

        </>
    


  );
};

export default AdminDashboard;
