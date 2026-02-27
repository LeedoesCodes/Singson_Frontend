
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className='login-theme'><Login/></div>}/>
        <Route path="/dashboard" element={<div className="dashboard-theme"><Dashboard/></div>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
   </BrowserRouter>
  )
}

export default App;