import React, { useState, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid';

    function App() {
      const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
      });

      useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }, [tasks]);

      const addTask = (task) => {
        setTasks([...tasks, task]);
      };

      const updateTask = (updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      };

      const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
      };

      return (
        <div className="container">
          <div className="level">
            <div className="level-left">
              <h1 className="title is-1">To-Do List</h1>
            </div>
          </div>
          <TaskForm onAddTask={addTask} />
          <TaskList tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
        </div>
      );
    }

    function TaskForm({ onAddTask }) {
      const [taskName, setTaskName] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim() === '') return;
        const newTask = {
          id: uuidv4(),
          name: taskName,
          subtasks: [],
        };
        onAddTask(newTask);
        setTaskName('');
      };

      return (
        <form className="box" onSubmit={handleSubmit}>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
          </div>
          <button className="button is-primary" type="submit">Add Task</button>
        </form>
      );
    }

    function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
      return (
        <ul className="task-list">
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} />
          ))}
        </ul>
      );
    }

    function Task({ task, index, onUpdateTask, onDeleteTask }) {
      const [subtasks, setSubtasks] = useState(task.subtasks);
      const [showSubtaskForm, setShowSubtaskForm] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [editedTaskName, setEditedTaskName] = useState(task.name);

      useEffect(() => {
        onUpdateTask({ ...task, subtasks });
      }, [subtasks, task, onUpdateTask]);

      const addSubtask = (subtask) => {
        setSubtasks([...subtasks, subtask]);
        setShowSubtaskForm(false);
      };

      const updateSubtask = (updatedSubtask) => {
        setSubtasks(subtasks.map(subtask => subtask.id === updatedSubtask.id ? updatedSubtask : subtask));
      };

      const deleteSubtask = (subtaskId) => {
        setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
      };

      const handleEditTask = () => {
        setIsEditing(true);
      };

      const handleSaveTask = () => {
        if (editedTaskName.trim() === '') return;
        onUpdateTask({ ...task, name: editedTaskName });
        setIsEditing(false);
      };

      const handleCancelEdit = () => {
        setEditedTaskName(task.name);
        setIsEditing(false);
      };

      return (
        <li className="box task-item">
          {isEditing ? (
            <div className="field is-grouped">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                />
              </div>
              <div className="control">
                <button className="button is-success" onClick={handleSaveTask}>Save</button>
                <button className="button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <h3 className="title is-4">{index + 1}. {task.name}</h3>
          )}
          {!isEditing && (
            <div className="task-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="button is-small" onClick={handleEditTask}>&#9998;</button>
              <button className="button is-small is-danger" onClick={() => onDeleteTask(task.id)}>&#10006;</button>
            </div>
          )}
          <div className="add-subtask-container" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="button is-success is-small" onClick={() => setShowSubtaskForm(!showSubtaskForm)}>
              {showSubtaskForm ? 'Hide Subtask Form' : 'Add Subtask'}
            </button>
          </div>
          {showSubtaskForm && <SubtaskForm onAddSubtask={addSubtask} />}
          <SubtaskList subtasks={subtasks} onUpdateSubtask={updateSubtask} onDeleteSubtask={deleteSubtask} />
        </li>
      );
    }

    function SubtaskForm({ onAddSubtask }) {
      const [subtaskName, setSubtaskName] = useState('');
      const [startTime, setStartTime] = useState('');
      const [endTime, setEndTime] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (subtaskName.trim() === '') return;
        const newSubtask = {
          id: uuidv4(),
          name: subtaskName,
          startTime,
          endTime,
          completed: false,
        };
        onAddSubtask(newSubtask);
        setSubtaskName('');
        setStartTime('');
        setEndTime('');
      };

      return (
        <form className="box subtask-form" onSubmit={handleSubmit}>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Subtask Name"
                value={subtaskName}
                onChange={(e) => setSubtaskName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="datetime-local"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="datetime-local"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <button className="button is-primary" type="submit">Add Subtask</button>
        </form>
      );
    }

    function SubtaskList({ subtasks, onUpdateSubtask, onDeleteSubtask }) {
      return (
        <ul className="subtask-list">
          {subtasks.map((subtask) => (
            <Subtask key={subtask.id} subtask={subtask} onUpdateSubtask={onUpdateSubtask} onDeleteSubtask={onDeleteSubtask} />
          ))}
        </ul>
      );
    }

    function Subtask({ subtask, onUpdateSubtask, onDeleteSubtask }) {
      const [isEditing, setIsEditing] = useState(false);
      const [editedSubtaskName, setEditedSubtaskName] = useState(subtask.name);
      const [editedStartTime, setEditedStartTime] = useState(subtask.startTime);
      const [editedEndTime, setEditedEndTime] = useState(subtask.endTime);
      const [remainingTime, setRemainingTime] = useState(0);
      const [isActive, setIsActive] = useState(false);
      const [backgroundColor, setBackgroundColor] = useState('white');

      const handleToggleComplete = () => {
        const updatedSubtask = { ...subtask, completed: !subtask.completed };
        onUpdateSubtask(updatedSubtask);
      };

      const handleEditSubtask = () => {
        setIsEditing(true);
      };

      const handleSaveSubtask = () => {
        if (editedSubtaskName.trim() === '') return;
        const updatedSubtask = { ...subtask, name: editedSubtaskName, startTime: editedStartTime, endTime: editedEndTime };
        onUpdateSubtask(updatedSubtask);
        setIsEditing(false);
      };

      const handleCancelEdit = () => {
        setEditedSubtaskName(subtask.name);
        setEditedStartTime(subtask.startTime);
        setEditedEndTime(subtask.endTime);
        setIsEditing(false);
      };

      useEffect(() => {
        let intervalId;
        if (subtask.startTime && subtask.endTime) {
          const start = new Date(subtask.startTime).getTime();
          const end = new Date(subtask.endTime).getTime();
          const now = new Date().getTime();

          if (subtask.completed) {
            setBackgroundColor('#e6ffe6');
          } else if (start <= now && end > now) {
            setBackgroundColor('#e0f7fa');
            setIsActive(true);
            setRemainingTime(Math.max(0, Math.round((end - now) / 1000)));
            intervalId = setInterval(() => {
              setRemainingTime((prevTime) => {
                const newTime = Math.max(0, Math.round((end - new Date().getTime()) / 1000));
                if (newTime <= 0) {
                  clearInterval(intervalId);
                  setIsActive(false);
                }
                return newTime;
              });
            }, 1000);
          } else if (start > now) {
            setBackgroundColor('white');
            const timeout = setTimeout(() => {
              alert(`Subtask "${subtask.name}" has started!`);
              setIsActive(true);
              setBackgroundColor('#e0f7fa');
              setRemainingTime(Math.max(0, Math.round((end - new Date().getTime()) / 1000)));
              intervalId = setInterval(() => {
                setRemainingTime((prevTime) => {
                  const newTime = Math.max(0, Math.round((end - new Date().getTime()) / 1000));
                  if (newTime <= 0) {
                    clearInterval(intervalId);
                    setIsActive(false);
                  }
                  return newTime;
                });
              }, 1000);
            }, start - now);
            return () => {
              clearTimeout(timeout);
              clearInterval(intervalId);
            };
          } else if (end <= now) {
            setBackgroundColor('#ffe0b2');
            setIsActive(false);
            clearInterval(intervalId);
          }
        }
        return () => clearInterval(intervalId);
      }, [subtask, subtask.completed]);

      useEffect(() => {
        if (subtask.completed) {
          setBackgroundColor('#e6ffe6');
        }
      }, [subtask.completed]);

      const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return `${formattedDate}, ${formattedTime}`;
      };

      return (
        <li className={`box subtask-item ${isActive ? 'active' : ''}`} style={{ backgroundColor: backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isEditing ? (
            <div className="field is-grouped">
              <div className="control is-expanded">
                <input
                  className="input"
                  type="text"
                  value={editedSubtaskName}
                  onChange={(e) => setEditedSubtaskName(e.target.value)}
                />
              </div>
              <div className="control">
                <input
                  className="input"
                  type="datetime-local"
                  value={editedStartTime}
                  onChange={(e) => setEditedStartTime(e.target.value)}
                />
              </div>
              <div className="control">
                <input
                  className="input"
                  type="datetime-local"
                  value={editedEndTime}
                  onChange={(e) => setEditedEndTime(e.target.value)}
                />
              </div>
              <div className="control">
                <button className="button is-success" onClick={handleSaveSubtask}>Save</button>
                <button className="button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.1em' }}>{subtask.name}</strong>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="time-details">
                      {subtask.startTime && subtask.endTime && (
                        <p className="time-range">
                          {formatDateTime(subtask.startTime)} - {formatDateTime(subtask.endTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isActive && <span className="timer-text">{formatTime(remainingTime)}</span>}
                  <div className="toggle-container">
                    <input
                      type="checkbox"
                      id={`toggle-${subtask.id}`}
                      checked={subtask.completed}
                      onChange={handleToggleComplete}
                    />
                    <label htmlFor={`toggle-${subtask.id}`} className="slider"></label>
                  </div>
                </div>
              </div>
            </>
          )}
          {!isEditing && (
            <div className="subtask-actions">
              <button className="button is-small" onClick={handleEditSubtask}>&#9998;</button>
              <button className="button is-small is-danger" onClick={() => onDeleteSubtask(subtask.id)}>&#10006;</button>
            </div>
          )}
        </li>
      );
    }

    export default App;
