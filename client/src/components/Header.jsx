import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ role, name, onPasswordClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };


  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom shadow-sm">
      <h5 className="mb-0">Welcome, <strong>{name || role.toUpperCase()}</strong></h5>
        <div>
            <button className="btn btn-outline-warning me-2" onClick={onPasswordClick}>
            🔑 Change Password
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
            🚪 Logout
            </button>
        </div>
    </div>
  );
};

export default Header;
