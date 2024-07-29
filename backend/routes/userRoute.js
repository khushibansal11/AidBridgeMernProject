const express = require("express");
const router = express.Router();
const { registerUser,loginUser,logout,forgotPassword,resetPassword,getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser, completeUserProfile, createHelperReview, getHelperReviews, deleteReview, createProblem, deleteProblem, changeStatusProblem, addHelperSkill, getNearbyUsersWithSkills, getNearbyUsersWithSkillsSeeker, applyForProblem, getUserProblemDetails, addNotification, getNotificationsWithDetails, deleteNotification, addNotificationHelper, sendNotification } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/Auth");

router.route("/register").post(registerUser);

router.route("/profile/complete").post(isAuthenticatedUser,completeUserProfile);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/password/update").put(isAuthenticatedUser,updatePassword)

router.route("/skill").put(isAuthenticatedUser,addHelperSkill)

router.route("/me/update").put(isAuthenticatedUser,updateProfile)

router.route("/problem").put(isAuthenticatedUser,createProblem).delete(isAuthenticatedUser,deleteProblem)
router.route("/problem/status").put(isAuthenticatedUser,changeStatusProblem)

router.route("/review").put(isAuthenticatedUser,createHelperReview)

router.route("/reviews")
.get(isAuthenticatedUser,getHelperReviews)
.delete(isAuthenticatedUser,deleteReview);

router.route("/user/:id").get(isAuthenticatedUser,getSingleUser)

router.route('/nearby').post(isAuthenticatedUser, getNearbyUsersWithSkills)
router.route('/nearbySeekers').post(isAuthenticatedUser, getNearbyUsersWithSkillsSeeker);

router.route('/problem/apply').post(isAuthenticatedUser, applyForProblem);

router.route('/application').post(isAuthenticatedUser, getUserProblemDetails);

router.route('/notification').post(isAuthenticatedUser, addNotification);

router.route('/notification-helper').post(isAuthenticatedUser, addNotificationHelper);

router.route('/notifications').get(isAuthenticatedUser, getNotificationsWithDetails);

router.route('/notifications/delete').post(isAuthenticatedUser, deleteNotification);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser)

router.route("/admin/user/:id")
.get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

router.route("/admin/notifications").post(isAuthenticatedUser,authorizeRoles("admin"),sendNotification)

module.exports = router