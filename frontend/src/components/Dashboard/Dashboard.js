import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    skills: 0,
    retentionItems: 0,
    tasksToday: 0,
    tasksTomorrow: 0
  });
  const [todayTasks, setTodayTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const tasksResponse = await axios.get(`http://https://skill-sync-bl6v.onrender.com//api/tasks/user/${user.id}`, config);

      setTodayTasks(tasksResponse.data.todayTasks || []);
      setTomorrowTasks(tasksResponse.data.tomorrowTasks || []);

      setStats({
        skills: 0,
        retentionItems: 0,
        tasksToday: tasksResponse.data.todayTasks?.length || 0,
        tasksTomorrow: tasksResponse.data.tomorrowTasks?.length || 0
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p className="tagline">Let's Start Solve Secure</p>
      </div>

      <div className="stats-grid grid grid-2">
        <div className="stat-card card">
          <div className="stat-icon">🎯</div>
          <h3>Skills Tracked</h3>
          <p className="stat-number">{stats.skills}</p>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">🧠</div>
          <h3>Learning Items</h3>
          <p className="stat-number">{stats.retentionItems}</p>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">✅</div>
          <h3>Today's Tasks</h3>
          <p className="stat-number">{stats.tasksToday}</p>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">📅</div>
          <h3>Tomorrow's Tasks</h3>
          <p className="stat-number">{stats.tasksTomorrow}</p>
        </div>
      </div>

      <div className="tasks-preview">
        <div className="card">
          <h2>Today's Tasks</h2>
          {todayTasks.length === 0 ? (
            <p className="empty-state">No tasks for today! 🎉</p>
          ) : (
            todayTasks.map(task => (
              <div key={task._id} className={`task-card priority-${task.priority}`}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>Tomorrow's Preview 🔮</h2>
          {tomorrowTasks.length === 0 ? (
            <p className="empty-state">Nothing scheduled for tomorrow</p>
          ) : (
            tomorrowTasks.map(task => (
              <div key={task._id} className={`task-card tomorrow priority-${task.priority}`}>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;