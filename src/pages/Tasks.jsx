import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        if (response.data.success) {
          setTasks(response.data.tasks);
        } else {
          toast.error('Failed to fetch tasks.');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !dueDate) return;

    const task = {
      title: taskTitle,
      description: taskDescription,
      due_date: dueDate,
      priority,
    };

    try {
      const response = await api.post('/tasks', task);
    
      if (response.data.success) {
        // Add new task at the top of the list
        setTasks([{ id: response.data.taskId, ...task }, ...tasks]);
        toast.success('Task added successfully!');
        clearForm();
      } else {
        toast.error(response.data.message || 'Failed to add task.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(error.response?.data?.message || 'Failed to add task.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    const formattedDueDate = new Date(task.due_date).toISOString().slice(0, 10);
    setDueDate(formattedDueDate);
    setPriority(task.priority);
    setIsFormVisible(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !dueDate) return;

    try {
      const response = await api.put(`/tasks/${editingTask.id}`, {
        title: taskTitle,
        description: taskDescription,
        due_date: dueDate,
        priority,
      });
      if (response.data.success) {
        setTasks(tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, title: taskTitle, description: taskDescription, due_date: dueDate, priority }
            : task
        ));
        toast.success('Task updated successfully!');
        clearForm();
      } else {
        toast.error(response.data.message || 'Failed to update task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      if (response.data.success) {
        setTasks(tasks.filter((task) => task.id !== taskId));
        toast.success('Task deleted successfully!');
      } else {
        toast.error(response.data.message || 'Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task.');
    } finally {
      setConfirmDeleteId(null); // Reset the confirmation state
    }
  };

  const clearForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setDueDate('');
    setPriority('Medium');
    setEditingTask(null);
    setIsFormVisible(false);
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="my-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h4 className="mb-3 text-gold">{editingTask ? 'Edit Task' : 'Add New Task'}</h4>

          {/* Button to toggle form visibility */}
          <Button variant='outline-gold' onClick={() => setIsFormVisible(!isFormVisible)} className="mb-3">
            {isFormVisible ? 'View Task List' : 'Add New Task'}
          </Button>

          {/* Conditional rendering for the form or task list */}
          {isFormVisible ? (
            <Form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Task Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant='outline-purple' type="submit">
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
              {editingTask && (
                <Button variant="outline-secondary" className="ms-2" onClick={clearForm}>
                  Cancel
                </Button>
              )}
            </Form>
          ) : (
            <>
              {/* Search Input */}
              <Form.Group className="mb-3">
                <Form.Label>Search Tasks</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by task title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>

              {/* Task List */}
              <h4 className="mb-3 text-gold">Task List</h4>
              {loading ? (
                <p>Loading tasks...</p>
              ) : filteredTasks.length === 0 ? (
                <p className="text-muted">No tasks found. Please add a new task.</p>
              ) : (
                <ListGroup>
                  {filteredTasks.map((task) => (
                    <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{task.title} <span className="text-muted">({task.priority})</span></h6>
                        <p>{task.description}</p>
                        <small className="text-muted">Due: {new Date(task.due_date).toLocaleDateString()}</small>
                      </div>
                      <div>
                        <Button variant="outline-secondary me-1" onClick={() => handleEditTask(task)}>
                          <FaEdit className="d-block d-md-none" /> <span className="d-none d-md-block">Edit</span>
                        </Button>
                        {confirmDeleteId === task.id ? (
                          <>
                            <span>Are you sure?</span>
                            <Button variant="outline-danger" onClick={() => handleDeleteTask(task.id)}>Yes</Button>
                            <Button variant="outline-secondary" onClick={() => setConfirmDeleteId(null)}>No</Button>
                          </>
                        ) : (
                          <Button variant="outline-danger" onClick={() => setConfirmDeleteId(task.id)}>
                            <FaTrashAlt className="d-block d-md-none" /> <span className="d-none d-md-block">Delete</span>
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Tasks;
