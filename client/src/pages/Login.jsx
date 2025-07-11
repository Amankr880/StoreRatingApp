import React, { useState } from 'react';
import { loginUser } from '../services/authService';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setMessage('✅ Login successful! Redirecting...');

      setTimeout(() => {
        if (res.data.role === 'admin') window.location.href = '/admin';
        else if (res.data.role === 'store_owner') window.location.href = '/store-owner';
        else window.location.href = '/user';
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 className="text-center mb-4">🔐 Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input name="email" type="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input name="password" type="password" className="form-control" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
            Don't have an account? <a href="/register">Register here</a>
        </p>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
