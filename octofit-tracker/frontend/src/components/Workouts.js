import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed workouts:', workoutsData);
        
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading workouts...
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="bi bi-heart-pulse me-2"></i>Personalized Workouts
      </h2>
      <p className="lead text-muted mb-4">AI-powered workout recommendations tailored to your goals</p>
      <div className="row">
        {workouts.length > 0 ? (
          workouts.map((workout, index) => {
            let difficultyBadge = 'bg-secondary';
            let difficultyColor = '#6c757d';
            if (workout.difficulty?.toLowerCase() === 'easy') { difficultyBadge = 'bg-success'; difficultyColor = '#28a745'; }
            else if (workout.difficulty?.toLowerCase() === 'medium') { difficultyBadge = 'bg-warning text-dark'; difficultyColor = '#ffc107'; }
            else if (workout.difficulty?.toLowerCase() === 'hard') { difficultyBadge = 'bg-danger'; difficultyColor = '#dc3545'; }
            
            return (
              <div key={workout.id || index} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm" style={{borderTop: `4px solid ${difficultyColor}`}}>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        <i className="bi bi-lightning-charge me-2"></i>
                        {workout.name || 'Unnamed Workout'}
                      </h5>
                      <span className={`badge ${difficultyBadge}`}>
                        {workout.difficulty || 'N/A'}
                      </span>
                    </div>
                    <p className="card-text text-muted small mb-3">
                      <i className="bi bi-person-circle me-1"></i>
                      {workout.user_name || workout.user || 'N/A'}
                    </p>
                    <p className="card-text flex-grow-1">
                      {workout.description || 'No description available'}
                    </p>
                    <hr />
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="text-muted small">
                            <i className="bi bi-clock me-1"></i>
                            Duration
                          </div>
                          <strong>{workout.duration || 0} min</strong>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="text-muted small">
                            <i className="bi bi-fire me-1"></i>
                            Calories
                          </div>
                          <strong>{workout.target_calories || 0}</strong>
                        </div>
                      </div>
                    </div>
                    {workout.workout_type && (
                      <div className="mb-3">
                        <span className="badge bg-info text-dark w-100">
                          <i className="bi bi-list-task me-1"></i>
                          {workout.workout_type}
                        </span>
                      </div>
                    )}
                    <button className="btn btn-primary w-100 mt-auto">
                      <i className="bi bi-play-circle me-2"></i>
                      Start Workout
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center py-5">
              <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
              <p className="mt-3 mb-0">No workouts found</p>
            </div>
          </div>
        )}
      </div>
      {workouts.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">Total workouts: {workouts.length}</small>
        </div>
      )}
    </div>
  );
}

export default Workouts;
