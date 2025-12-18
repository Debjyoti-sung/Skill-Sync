import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RetentionTracker.css';

function RetentionTracker({ user }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ content: '', skill: '' });
  const [currentReview, setCurrentReview] = useState(null);

  useEffect(() => {
    loadDueItems();
  }, [user]);

  const loadDueItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://https://skill-sync-bl6v.onrender.com//api/retention/due/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://https://skill-sync-bl6v.onrender.com//api/retention/add',
        { ...newItem, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewItem({ content: '', skill: '' });
      setShowForm(false);
      loadDueItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const reviewItem = async (quality) => {
    if (!currentReview) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://https://skill-sync-bl6v.onrender.com//api/retention/review/${currentReview._id}`,
        { quality },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentReview(null);
      loadDueItems();
    } catch (error) {
      console.error('Error reviewing item:', error);
    }
  };

  return (
    <div className="container">
      <div className="retention-header">
        <h1>🧠 Retention Tracker (SM-2 Algorithm)</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          + Add Learning Item
        </button>
      </div>

      {showForm && (
        <div className="card retention-form">
          <h2>Add Learning Item</h2>
          <form onSubmit={addItem}>
            <div className="input-group">
              <label>Skill</label>
              <input
                type="text"
                value={newItem.skill}
                onChange={(e) => setNewItem({...newItem, skill: e.target.value})}
                placeholder="e.g., React Hooks"
                required
              />
            </div>

            <div className="input-group">
              <label>Content to Remember</label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                placeholder="What do you want to remember about this skill?"
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Item</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {currentReview ? (
        <div className="review-session card">
          <h2>Review Session</h2>
          <div className="review-card">
            <div className="review-skill">
              <span className="skill-tag">{currentReview.skill}</span>
            </div>
            <div className="review-content">
              <p>{currentReview.content}</p>
            </div>
            <div className="review-stats">
              <span>Repetitions: {currentReview.repetitions}</span>
              <span>Ease: {currentReview.easeFactor.toFixed(2)}</span>
            </div>
          </div>

          <div className="quality-buttons">
            <h3>How well did you remember this?</h3>
            <div className="quality-grid">
              <button onClick={() => reviewItem(0)} className="quality-btn q0">
                0 - Forgot
              </button>
              <button onClick={() => reviewItem(1)} className="quality-btn q1">
                1 - Hard
              </button>
              <button onClick={() => reviewItem(2)} className="quality-btn q2">
                2 - Difficult
              </button>
              <button onClick={() => reviewItem(3)} className="quality-btn q3">
                3 - Recalled
              </button>
              <button onClick={() => reviewItem(4)} className="quality-btn q4">
                4 - Easy
              </button>
              <button onClick={() => reviewItem(5)} className="quality-btn q5">
                5 - Perfect
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2>Items Due for Review</h2>
          {items.length === 0 ? (
            <p className="empty-state">No items due for review! 🎉</p>
          ) : (
            <div className="items-list">
              {items.map(item => (
                <div key={item._id} className="retention-item">
                  <div className="item-content">
                    <h4>{item.skill}</h4>
                    <p className="item-preview">{item.content.substring(0, 100)}...</p>
                    <div className="item-meta">
                      <span>Rep: {item.repetitions}</span>
                      <span>Ease: {item.easeFactor.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentReview(item)}
                    className="btn btn-primary btn-sm"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RetentionTracker;