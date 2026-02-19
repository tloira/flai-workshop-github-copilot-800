import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-4">
      <div className="jumbotron p-5 rounded">
        <h1 className="display-4">
          <i className="bi bi-heart-pulse-fill me-3"></i>
          Welcome to OctoFit Tracker
        </h1>
        <p className="lead">
          Track your fitness activities, compete with your team, and achieve your fitness goals!
        </p>
        <hr className="my-4" />
        <p>
          Use the navigation menu above to explore different sections of the app.
        </p>
        <div className="row mt-5">
          <div className="col-md-4 mb-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="bi bi-activity" style={{fontSize: '3rem', color: '#667eea'}}></i>
                <h5 className="card-title mt-3">Track Activities</h5>
                <p className="card-text">Log your workouts and monitor your progress over time.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="bi bi-trophy-fill" style={{fontSize: '3rem', color: '#667eea'}}></i>
                <h5 className="card-title mt-3">Compete</h5>
                <p className="card-text">Challenge your teammates and climb the leaderboard.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="bi bi-lightning-charge-fill" style={{fontSize: '3rem', color: '#667eea'}}></i>
                <h5 className="card-title mt-3">Get Personalized</h5>
                <p className="card-text">Receive AI-powered workout recommendations tailored to you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-heart-pulse-fill me-2"></i>
            OctoFit Tracker
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <i className="bi bi-house-fill me-1"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  <i className="bi bi-person-circle me-1"></i>
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">
                  <i className="bi bi-people-fill me-1"></i>
                  Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">
                  <i className="bi bi-activity me-1"></i>
                  Activities
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">
                  <i className="bi bi-trophy-fill me-1"></i>
                  Leaderboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">
                  <i className="bi bi-lightning-charge-fill me-1"></i>
                  Workouts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
