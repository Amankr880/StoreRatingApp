import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setMessage('✅ Registration successful! You can now log in.');
        setTimeout(() => {
            navigate('/login');
        }, 1500); 
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 className="text-center mb-4">📝 Register (Normal User)</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input name="email" type="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Address</label>
            <input name="address" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input name="password" type="password" className="form-control" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <p className="mt-3 text-center">
            Already have an account? <a href="/login">Login here</a>
        </p>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default Register;
