import React, { useState, useEffect } from 'react';
import UserEditModal from './UserEditModal';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const usersUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';
        
        const teamsUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
          : 'http://localhost:8000/api/teams/';
        
        console.log('Fetching users from:', usersUrl);
        console.log('Fetching teams from:', teamsUrl);
        
        // Fetch both users and teams in parallel
        const [usersResponse, teamsResponse] = await Promise.all([
          fetch(usersUrl),
          fetch(teamsUrl)
        ]);
        
        if (!usersResponse.ok) {
          throw new Error(`HTTP error fetching users! status: ${usersResponse.status}`);
        }
        if (!teamsResponse.ok) {
          throw new Error(`HTTP error fetching teams! status: ${teamsResponse.status}`);
        }
        
        const usersData = await usersResponse.json();
        const teamsData = await teamsResponse.json();
        
        console.log('Users data received:', usersData);
        console.log('Teams data received:', teamsData);
        
        // Handle both paginated (.results) and plain array responses
        const processedUsers = usersData.results || usersData;
        const processedTeams = teamsData.results || teamsData;
        
        setUsers(Array.isArray(processedUsers) ? processedUsers : []);
        setTeams(Array.isArray(processedTeams) ? processedTeams : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  const handleSaveUser = (updatedUser) => {
    // Update the user in the local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading users...
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
        <i className="bi bi-person-circle me-2"></i>Users
      </h2>
      <p className="lead text-muted mb-4">Meet our fitness community members</p>
      <div className="row">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={user.id || index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
                      {user.avatar || user.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h5 className="card-title mb-0">{user.name || user.username || 'Unknown User'}</h5>
                      <small className="text-muted">{user.hero_name || user.email || ''}</small>
                    </div>
                  </div>
                  <hr />
                  <div className="mb-2">
                    <i className="bi bi-envelope me-2 text-muted"></i>
                    <small>{user.email || 'N/A'}</small>
                  </div>
                  {user.team_name && (
                    <div className="mb-2">
                      <i className="bi bi-people me-2 text-muted"></i>
                      <span className="badge bg-info text-dark">{user.team_name}</span>
                    </div>
                  )}
                  {(user.first_name || user.last_name) && (
                    <div className="mb-2">
                      <i className="bi bi-person me-2 text-muted"></i>
                      <small>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}</small>
                    </div>
                  )}
                  <div className="row mt-3">
                    {user.height && (
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="text-muted small">Height</div>
                          <strong>{user.height} cm</strong>
                        </div>
                      </div>
                    )}
                    {user.weight && (
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="text-muted small">Weight</div>
                          <strong>{user.weight} kg</strong>
                        </div>
                      </div>
                    )}
                  </div>
                  {user.fitness_goal && (
                    <div className="mt-3">
                      <span className="badge bg-success w-100">
                        <i className="bi bi-target me-1"></i>
                        {user.fitness_goal}
                      </span>
                    </div>
                  )}
                  {user.total_points !== undefined && (
                    <div className="mt-3 text-center">
                      <span className="badge bg-primary fs-6">
                        <i className="bi bi-trophy-fill me-1"></i>
                        {user.total_points} points
                      </span>
                    </div>
                  )}
                  <button 
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => handleEditClick(user)}
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center py-5">
              <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
              <p className="mt-3 mb-0">No users found</p>
            </div>
          </div>
        )}
      </div>
      {users.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">Total users: {users.length}</small>
        </div>
      )}
      
      {editingUser && (
        <UserEditModal
          user={editingUser}
          teams={teams}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default Users;
