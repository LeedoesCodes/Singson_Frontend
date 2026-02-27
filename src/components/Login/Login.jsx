import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setError('');

    if (email === 'admin@test.com' && password === '123456') {
      console.log('Login successful:', { email });
      

      navigate('/dashboard'); 
      
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <h1>Welcome Back!</h1>
        <p>Please log in to access your dashboard and manage your workspace.</p>
      </div>

      <div className="login-form-wrapper">
        <div className="login-card">
          <h2>Account Login</h2>
          
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="login-btn">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;