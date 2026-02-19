import React, { useState, useEffect } from 'react';

function UserEditModal({ user, teams, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hero_name: '',
    team_id: '',
    avatar: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        hero_name: user.hero_name || '',
        team_id: user.team_id || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
      const apiUrl = codespaceName 
        ? `https://${codespaceName}-8000.app.github.dev/api/users/${user.id}/`
        : `http://localhost:8000/api/users/${user.id}/`;

      // Find the selected team to update team_name
      const selectedTeam = teams.find(t => t.id === formData.team_id);
      const updateData = {
        ...formData,
        team_name: selectedTeam ? selectedTeam.name : formData.team_name
      };

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      onSave(updatedUser);
      onClose();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              Edit User Details
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={saving}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <i className="bi bi-person me-1"></i>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-1"></i>
                  Email *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="hero_name" className="form-label">
                  <i className="bi bi-star me-1"></i>
                  Hero Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="hero_name"
                  name="hero_name"
                  value={formData.hero_name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="team_id" className="form-label">
                  <i className="bi bi-people me-1"></i>
                  Team *
                </label>
                <select
                  className="form-select"
                  id="team_id"
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="">-- Select a Team --</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">
                  <i className="bi bi-emoji-smile me-1"></i>
                  Avatar (emoji or single character)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  maxLength="10"
                  disabled={saving}
                  placeholder="😊"
                />
                <small className="text-muted">
                  Display avatar (e.g., emoji or letter)
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserEditModal;
