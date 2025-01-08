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

      return (
        <div>
          <h1>To-Do List</h1>
          <TaskForm onAddTask={addTask} />
          <TaskList tasks={tasks} onUpdateTask={updateTask} />
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
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      );
    }

    function TaskList({ tasks, onUpdateTask }) {
      return (
        <ul className="task-list">
          {tasks.map((task) => (
            <Task key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))}
        </ul>
      );
    }

    function Task({ task, onUpdateTask }) {
      const [subtasks, setSubtasks] = useState(task.subtasks);
      const [showSubtaskForm, setShowSubtaskForm] = useState(false);

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

      return (
        <li className="task-item">
          <h3>{task.name}</h3>
          <button onClick={() => setShowSubtaskForm(!showSubtaskForm)}>
            {showSubtaskForm ? 'Hide Subtask Form' : 'Add Subtask'}
          </button>
          {showSubtaskForm && <SubtaskForm onAddSubtask={addSubtask} />}
          <SubtaskList subtasks={subtasks} onUpdateSubtask={updateSubtask} />
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
        <form className="subtask-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Subtask Name"
            value={subtaskName}
            onChange={(e) => setSubtaskName(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button type="submit">Add Subtask</button>
        </form>
      );
    }

    function SubtaskList({ subtasks, onUpdateSubtask }) {
      return (
        <ul className="subtask-list">
          {subtasks.map((subtask) => (
            <Subtask key={subtask.id} subtask={subtask} onUpdateSubtask={onUpdateSubtask} />
          ))}
        </ul>
      );
    }

    function Subtask({ subtask, onUpdateSubtask }) {
      const handleToggleComplete = () => {
        const updatedSubtask = { ...subtask, completed: !subtask.completed };
        onUpdateSubtask(updatedSubtask);
      };

      useEffect(() => {
        if (subtask.startTime) {
          const start = new Date(subtask.startTime).getTime();
          const now = new Date().getTime();
          if (start > now) {
            const timeout = setTimeout(() => {
              alert(`Subtask "${subtask.name}" has started!`);
            }, start - now);
            return () => clearTimeout(timeout);
          }
        }
        if (subtask.endTime) {
          const end = new Date(subtask.endTime).getTime();
          const now = new Date().getTime();
          if (end > now) {
            const timeout = setTimeout(() => {
              alert(`Subtask "${subtask.name}" has ended!`);
            }, end - now);
            return () => clearTimeout(timeout);
          }
        }
      }, [subtask]);

      return (
        <li className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={handleToggleComplete}
          />
          {subtask.name}
          {subtask.startTime && <p>Start: {new Date(subtask.startTime).toLocaleString()}</p>}
          {subtask.endTime && <p>End: {new Date(subtask.endTime).toLocaleString()}</p>}
        </li>
      );
    }

    export default App;
