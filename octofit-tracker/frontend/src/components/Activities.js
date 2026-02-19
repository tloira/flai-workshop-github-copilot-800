import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
          : 'http://localhost:8000/api/activities/';
        
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Processed activities:', activitiesData);
        
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading activities...
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
        <i className="bi bi-activity me-2"></i>Activities Tracker
      </h2>
      <p className="lead text-muted mb-4">Track all fitness activities and progress</p>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Hero Name</th>
              <th scope="col">Workout Type</th>
              <th scope="col">Quantity</th>
              <th scope="col">Unit</th>
              <th scope="col">Points</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <tr key={activity.id || index}>
                  <td>
                    <strong>{activity.user_name || 'N/A'}</strong>
                  </td>
                  <td>
                    <span className="text-muted">{activity.hero_name || 'N/A'}</span>
                  </td>
                  <td>
                    <span className="badge bg-primary">{activity.workout_type || 'N/A'}</span>
                  </td>
                  <td>{activity.quantity ? parseFloat(activity.quantity).toFixed(1) : 0}</td>
                  <td>
                    <small className="text-muted">{activity.unit || 'N/A'}</small>
                  </td>
                  <td>
                    <span className="badge bg-success">{activity.points || 0} pts</span>
                  </td>
                  <td>{activity.date ? new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-5">
                  <div>
                    <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
                    <p className="mt-3">No activities found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {activities.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">Total activities: {activities.length}</small>
        </div>
      )}
    </div>
  );
}

export default Activities;
