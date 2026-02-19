import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
          : 'http://localhost:8000/api/leaderboard/';
        
        console.log('Fetching leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed leaderboard:', leaderboardData);
        
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading leaderboard...
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
        <i className="bi bi-trophy me-2"></i>Leaderboard
      </h2>
      <p className="lead text-muted mb-4">Top performers and their achievements</p>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col" style={{width: '80px'}}>Rank</th>
              <th scope="col">User</th>
              <th scope="col">Hero Name</th>
              <th scope="col">Team</th>
              <th scope="col" className="text-end">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => {
                let rankBadge = 'bg-secondary';
                let rankIcon = '';
                if (index === 0) { rankBadge = 'bg-warning text-dark'; rankIcon = '🥇 '; }
                else if (index === 1) { rankBadge = 'bg-secondary'; rankIcon = '🥈 '; }
                else if (index === 2) { rankBadge = 'bg-danger'; rankIcon = '🥉 '; }
                
                return (
                  <tr key={entry.id || index}>
                    <td>
                      <span className={`badge ${rankBadge} fs-6`}>
                        {rankIcon}{entry.rank || index + 1}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {entry.avatar && <span className="me-2">{entry.avatar}</span>}
                        {entry.user_name || 'N/A'}
                      </strong>
                    </td>
                    <td>
                      <span className="text-muted">{entry.hero_name || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">{entry.team_name || 'N/A'}</span>
                    </td>
                    <td className="text-end">
                      <span className="badge bg-primary fs-6">{entry.total_points || 0} pts</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-5">
                  <div>
                    <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
                    <p className="mt-3">No leaderboard entries found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {leaderboard.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">Showing top {leaderboard.length} performers</small>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
