// All API routes
const express = require('express');

const { logout, verifyAccount, requestVerificationToken } = require('../controllers/authController');
const { changePassword, updateNotificationPreferences, deleteAccount, getUserDetails, fetchNotificationPreferences } = require('../controllers/userController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const taskController = require('../controllers/taskController');
const { searchUsers } = require('../controllers/searchController');
const messagesController = require('../controllers/messagesController');
const eventController = require('../controllers/eventController');
const { getNotifications, deleteNotification } = require('../controllers/notificationsController');
const clubsController = require('../controllers/clubsController');
const upload = require('../config/multer');

const router = express.Router();

// Logout Route
router.post('/logout', logout);

// Token verification
router.get('/verify-account', verifyAccount);
router.post('/request-verification-token', requestVerificationToken);

// Token validation route
router.post('/validate-token', (req, res) => {
  res.json({ valid: true, user: req.user });
});

// User settings routes
router.put('/change-password', changePassword);
router.put('/notification-preferences', updateNotificationPreferences);
router.delete('/delete-account', deleteAccount);

// User routes
router.get('/user', getUserDetails);

// Profile routes
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', upload.single('profile_pics'), updateProfile);

// Notification preferences
router.get('/notification-preferences', fetchNotificationPreferences);

// Task routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasksByUser);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

// Search route
router.get('/search', searchUsers);

// Messaging routes
router.get('/conversations', messagesController.fetchConversations);
router.get('/conversations/:conversationId/messages', messagesController.fetchMessages);
router.post('/messages', messagesController.sendMessage);
router.put('/messages/:messageId/read', messagesController.updateMessageStatus);
router.delete('/messages/:messageId', messagesController.deleteMessage);

// Notifications route
router.get('/notifications', getNotifications);
router.delete('/notifications/:id', deleteNotification);

// Events routes
router.get('/events', eventController.getAllEvents);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.put('/events/rsvp/:id', eventController.toggleRSVP);

// Club routes
router.get('/clubs', clubsController.getClubs);
router.post('/clubs', clubsController.createClub);
router.post('/clubs/:clubId/join', clubsController.joinClub);
router.get('/clubs/:clubId', clubsController.getClubOverview);

module.exports = router;