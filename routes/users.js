const router = require('express').Router();
const { getAllUsers, updateUser, updatePassword, showCurrentUser, getSingleUser } = require('../controllers/UserController');
const { authorizePermissions } = require('../middlewares/auth');

router.route('/').get(authorizePermissions('admin'), getAllUsers); // Only admin can access all the users that's why we use the authorizePermissions middleware
router.route('/show-me').get(showCurrentUser);
router.route('/update-user').patch(updateUser);
router.route('/update-password').patch(updatePassword);
router.route('/:id').get(getSingleUser);

module.exports = router;