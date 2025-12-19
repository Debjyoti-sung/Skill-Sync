import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TaskManager.css';

function TaskManager({ user }) {
  const [tasks, setTasks] = useState({ todayTasks: [], tomorrowTasks: [] });
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const loadTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://skill-sync-bl6v.onrender.com/api/tasks/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, [user.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://skill-sync-bl6v.onrender.com/api/tasks/create', 
        { ...newTask, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      setShowForm(false);
      loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://skill-sync-bl6v.onrender.com/api/tasks/update/${taskId}`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="container">
      <div className="task-header">
        <h1>📋 Task Manager</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          + New Task
        </button>
      </div>

      {showForm && (
        <div className="card task-form">
          <h2>Create New Task</h2>
          <form onSubmit={createTask}>
            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  required
                />
              </div>

              <div className="input-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Task</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-sections">
        <div className="card">
          <h2>✅ Today's Tasks</h2>
          {tasks.todayTasks?.length === 0 ? (
            <p className="empty-state">No tasks for today!</p>
          ) : (
            tasks.todayTasks?.map(task => (
              <div key={task._id} className={`task-card priority-${task.priority}`}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => completeTask(task._id)}
                  className="btn btn-secondary btn-sm"
                >
                  Complete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="card tomorrow-section">
          <h2>🔮 Tomorrow's Preview</h2>
          <p className="section-subtitle">Get ready for what's coming!</p>
          {tasks.tomorrowTasks?.length === 0 ? (
            <p className="empty-state">Nothing scheduled for tomorrow</p>
          ) : (
            tasks.tomorrowTasks?.map(task => (
              <div key={task._id} className={`task-card tomorrow priority-${task.priority}`}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;