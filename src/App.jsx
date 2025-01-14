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

      const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
      const [isPomodoroActive, setIsPomodoroActive] = useState(false);
      const [pomodoroIntervalId, setPomodoroIntervalId] = useState(null);

      const startPomodoro = () => {
        setIsPomodoroActive(true);
        setPomodoroTime(25 * 60);
        const intervalId = setInterval(() => {
          setPomodoroTime((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(intervalId);
              setIsPomodoroActive(false);
              alert('Pomodoro timer is complete!');
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        setPomodoroIntervalId(intervalId);
      };

      const stopPomodoro = () => {
        clearInterval(pomodoroIntervalId);
        setIsPomodoroActive(false);
      };

      const resetPomodoro = () => {
        clearInterval(pomodoroIntervalId);
        setIsPomodoroActive(false);
        setPomodoroTime(25 * 60);
      };

      const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true' || false;
      });

      useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }, [darkMode]);

      const toggleDarkMode = () => {
        setDarkMode(!darkMode);
      };

      return (
        <div className="container" >
          <br></br>
          <div className="level">
            <div className="level-left">
              <h1 className="title is-1" style={{fontFamily:'Permanent Marker'}}>To-Do List</h1>
            </div>
            <div className="level-right">
              <div className="pomodoro-timer" style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <span className="timer-text" style={{
                  backgroundColor: '#bbbbbb',
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  marginLeft: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>{formatTime(pomodoroTime)}</span>
                {!isPomodoroActive ? (
                  <button className="button is-small is-rounded" onClick={startPomodoro}>Start Pomodoro</button>
                ) : (
                  <>
                    <button className="button is-small is-rounded" onClick={stopPomodoro}>Stop</button>
                    <button className="button is-small is-rounded" onClick={resetPomodoro}>Reset</button>
                  </>
                )}
                <button className="button is-small is-rounded" onClick={toggleDarkMode}>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
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
          <button className="button is-primary is-outlined is-light is-rounded" type="submit">Add Task</button>
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
      const [hideCompleted, setHideCompleted] = useState(false);

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

      const toggleHideCompleted = () => {
        setHideCompleted(!hideCompleted);
      };

      return (
        <li className="box task-item" >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {isEditing ? (
              <div className="field is-grouped" style={{ flex: 1 }}>
                <div className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    value={editedTaskName}
                    onChange={(e) => setEditedTaskName(e.target.value)}
                  />
                </div>
                <div className="control">
                  <button className="button is-primary is-outlined is-light is-rounded" onClick={handleSaveTask}>Save</button>
                  <button className="button is-rounded" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <h3 className="title is-4" style={{ flex: 1, marginRight: '10px' }}>{index + 1}. {task.name}</h3>
            )}
            {!isEditing && (
              <div className="task-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="button is-rounded is-small" onClick={handleEditTask}>&#9998;</button>
                <button className="button is-rounded is-small is-danger" onClick={() => onDeleteTask(task.id)}>&#10006;</button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button className="button is-primary is-outlined is-light is-rounded is-small" onClick={() => setShowSubtaskForm(!showSubtaskForm)}>
              {showSubtaskForm ? 'Hide Subtask Form' : 'Add Subtask'}
            </button>
            <button className="button is-small is-rounded" onClick={toggleHideCompleted}>
              {hideCompleted ? 'Show Completed' : 'Hide Completed'}
            </button>
          </div>
          <br></br>
          {showSubtaskForm && <SubtaskForm onAddSubtask={addSubtask} />}
          <SubtaskList subtasks={subtasks} onUpdateSubtask={updateSubtask} onDeleteSubtask={deleteSubtask} hideCompleted={hideCompleted} setHideCompleted={setHideCompleted} />
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

    function SubtaskList({ subtasks, onUpdateSubtask, onDeleteSubtask, hideCompleted, setHideCompleted }) {
      const filteredSubtasks = hideCompleted ? subtasks.filter(subtask => !subtask.completed) : subtasks;
      return (
        <ul className="subtask-list">
          {filteredSubtasks.map((subtask) => (
            <Subtask key={subtask.id} subtask={subtask} onUpdateSubtask={onUpdateSubtask} onDeleteSubtask={onDeleteSubtask} setHideCompleted={setHideCompleted} />
          ))}
        </ul>
      );
    }

    function Subtask({ subtask, onUpdateSubtask, onDeleteSubtask, setHideCompleted }) {
      const [isEditing, setIsEditing] = useState(false);
      const [editedSubtaskName, setEditedSubtaskName] = useState(subtask.name);
      const [editedStartTime, setEditedStartTime] = useState(subtask.startTime);
      const [editedEndTime, setEditedEndTime] = useState(subtask.endTime);
      const [remainingTime, setRemainingTime] = useState(0);
      const [isActive, setIsActive] = useState(false);
      const [backgroundColor, setBackgroundColor] = useState('white');
      const [previousCompleted, setPreviousCompleted] = useState(subtask.completed);

      const handleToggleComplete = () => {
        const updatedSubtask = { ...subtask, completed: !subtask.completed };
        onUpdateSubtask(updatedSubtask);
        setHideCompleted(true);
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
        } else if (!subtask.completed && !isActive) {
          const end = subtask.endTime ? new Date(subtask.endTime).getTime() : null;
          const now = new Date().getTime();
          if (end && end <= now) {
            setBackgroundColor('#ffe0b2');
          } else {
            setBackgroundColor('white');
          }
        }
      }, [subtask.completed, isActive, subtask.endTime]);

      useEffect(() => {
        if (subtask.completed !== previousCompleted) {
          if (!subtask.completed) {
            const end = subtask.endTime ? new Date(subtask.endTime).getTime() : null;
            const now = new Date().getTime();
             if (end && end <= now) {
              setBackgroundColor('#ffe0b2');
            } else if (!end) {
              setBackgroundColor('#ffe0b2');
            } else {
              setBackgroundColor('white');
            }
          }
          setPreviousCompleted(subtask.completed);
        }
      }, [subtask.completed, previousCompleted, subtask.endTime]);

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
                <button className="button is-primary is-outlined is-light is-rounded" onClick={handleSaveSubtask}>Save</button>
                <button className="button is-rounded " onClick={handleCancelEdit}>Cancel</button>
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
                          <b>{formatDateTime(subtask.startTime)} - {formatDateTime(subtask.endTime)}</b>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isActive && <span className="timer-text" style={{
                    backgroundColor: '#bbbbbb',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    marginLeft: '8px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>{formatTime(remainingTime)}</span>}
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
              <button className="button is-rounded is-small" onClick={handleEditSubtask}>&#9998;</button>
              <button className="button is-rounded is-small is-danger" onClick={() => onDeleteSubtask(subtask.id)}>&#10006;</button>
            </div>
          )}
        </li>
      );
    }

    export default App;
