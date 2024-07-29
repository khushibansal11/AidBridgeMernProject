const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const cloudinary = require("cloudinary")
const User = require("../models/userModel.js")
const sendToken = require("../utils/jwtToken.js")
const sendEmail = require("../utils/sendEmail.js");
const nodeCrypto = require("crypto")
const { calculateDistance } = require('../utils/calculateDistance');


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  try {

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const { name, email, password, avatar, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      role
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

// Complete user profile
exports.completeUserProfile = catchAsyncErrors(async (req, res, next) => {
  const { location, phoneNo } = req.body;
  const user = await User.findById(req.user.id);
  const userRole = req.user.role;

  if (!req.body.location) {
    return next(new ErrorHandler("Location is Required", 401));
  }
  if (userRole === 'Helper') {
    req.user.bio = req.body.bio;
  }

  // Parse location if it is a string
  const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

  // Update the user location
  req.user.location = parsedLocation;
  req.user.phoneNo = phoneNo;
  req.user.completeProfile = true;

  await req.user.save();

  res.status(200).json({ success: true, user: req.user });

});


//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ErrorHandler("Please Enter Email & Password", 400));

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
})

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  //Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = nodeCrypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not Match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  })
})

//Update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
})

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const userRole = req.user.role;
  const parsedLocation = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    location: parsedLocation
  }

  if (userRole == "helper") {
    newUserData.skills = req.body.skills,
      newUserData.availability = req.body.availability,
      newUserData.bio = req.body.bio
  }

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`));
  }
  res.status(200).json({
    success: true,
  });
});

//Add Helper Skill and Availibility
exports.addHelperSkill = catchAsyncErrors(async (req, res, next) => {
  const { skills, availability } = req.body;

  if (!skills || !availability) {
    return next(new ErrorHandler(`Please add at least one skill and select availability.`));
  }

  const user = await User.findByIdAndUpdate(req.user.id, {
    skills,
    availability
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.user.id}`));
  }

  res.status(200).json({
    success: true,
  });
});


// Create Problem
exports.createProblem = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user.role !== "Seeker") {
    return next(new ErrorHandler("User is not a seeker", 403));
  }

  const { problem, preferredHelperSkills } = req.body;
  const singleProblem = {
    problem,
    preferredHelperSkills
  };
  user.problems.push(singleProblem);
  await user.save();
  res.status(200).json({
    success: true
  });
});

// Delete Problem
exports.deleteProblem = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  if (user.role !== 'Seeker') {
    return next(new ErrorHandler('User is not a seeker', 403));
  }

  const problemIndex = user.problems.findIndex((prob) => prob._id.toString() === req.query.problemId.toString());

  if (problemIndex === -1) {
    return next(new ErrorHandler('Problem not found', 404));
  }
  user.problems.splice(problemIndex, 1);

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Problem deleted successfully',
  });
});

//change status
exports.changeStatusProblem = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (user.role !== 'Seeker') {
    return next(new ErrorHandler('User is not a seeker', 403));
  }

  const problemIndex = user.problems.findIndex((prob) => prob._id.toString() === req.query.problemId.toString());

  if (problemIndex === -1) {
    return next(new ErrorHandler('Problem not found', 404));
  }

  user.problems[problemIndex].status = "resolved";

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Problem status updated successfully',
  });
});


//Create New Review or Update the review
exports.createHelperReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, helperId } = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar.url,
    rating: Number(rating),
    comment
  }
  const helper = await User.findById(helperId);
  if (!helper) {
    return next(new ErrorHandler("Helper Not Found", 400));

  }

  if (helper.role !== "Helper") {
    return next(new ErrorHandler("User is not a helper", 400));
  }
  const isReviewed = helper.reviews.find(rev => rev.user.toString() == req.user._id.toString());
  if (isReviewed) {
    helper.reviews.forEach((rev) => {
      if (rev.user.toString() == req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  }
  else {
    helper.reviews.push(review);
    helper.numOfReviews = helper.reviews.length;
  }
  let avg = 0;
  helper.reviews.forEach((rev) => {
    avg += rev.rating;
  })
  helper.ratings = avg / helper.reviews.length;

  await helper.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  })
});

//Get All Reviews of a helper
exports.getHelperReviews = catchAsyncErrors(async (req, res, next) => {
  const helper = await User.findById(req.query.id);
  if (!helper) {
    return next(new ErrorHandler("Helper not found", 404));
  }
  if (helper.role !== "Helper") {
    return next(new ErrorHandler("User is not a helper", 400));
  }
  res.status(200).json({
    success: true,
    reviews: helper.reviews
  });
})

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const helper = await User.findById(req.query.helperId);

  if (!helper) {
    return next(new ErrorHandler("Helper not found", 404));
  }
  if (helper.role !== "Helper") {
    return next(new ErrorHandler("User is not a helper", 400));
  }
  const reviews = helper.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await User.findByIdAndUpdate(req.query.helperId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true, useFindAndModify: false, }
  );

  res.status(200).json({
    success: true,
  });
});

//Get single user
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`));
  }
  res.status(200).json({
    success: true,
    user
  });
});


//Nearby User with skill -- for finding nearby helpers
exports.getNearbyUsersWithSkills = catchAsyncErrors(async (req, res) => {
  const { longitude, latitude, skills } = req.body;

  if (!longitude || !latitude || !skills || skills.length === 0) {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  const usersWithSkills = await User.find({
    skills: { $in: skills },
    role: 'Helper'
  });
  const nearbyUsers = usersWithSkills.filter(user => {
    const distance = calculateDistance(latitude, longitude, user.location.latitude, user.location.longitude);
    const maxDistance = 100;
    return distance <= maxDistance;
  });
  res.status(200).json({ users: nearbyUsers });
});

// Nearby User with skill - for finding nearby seekers for problems
exports.getNearbyUsersWithSkillsSeeker = catchAsyncErrors(async (req, res) => {
  const { longitude, latitude, skills } = req.body;

  if (!longitude || !latitude || !skills || skills.length === 0) {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  // Fetch users with the role 'Seeker'
  const usersWithRole = await User.find({ role: 'Seeker' });

  const nearbyUsers = usersWithRole.filter(user => {
    const distance = calculateDistance(latitude, longitude, user.location.latitude, user.location.longitude);
    const maxDistance = 50; // Distance in km
    return distance <= maxDistance;
  });
  // Filter users based on problems' preferred skills
  const usersWithMatchingSkills = nearbyUsers.map(user => {
    const matchingProblems = user.problems.filter(problem =>
      problem.status !== 'resolved' && problem.preferredHelperSkills.some(skill => skills.includes(skill))
    );
    if (matchingProblems.length > 0) {
      return { ...user._doc, matchingProblems }; // Attach matchingProblems temporarily
    }
    return null;
  }).filter(user => user !== null); // Remove users without matching problems

  res.status(200).json({ users: usersWithMatchingSkills });
});

//Apply for a problem
exports.applyForProblem = catchAsyncErrors(async (req, res, next) => {
  const { curUserID, userId, problemId } = req.body;
  if (!userId || !problemId) {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  const curUser = await User.findById(curUserID);
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const problem = user.problems.id(problemId);
  if (!problem || problem.status === 'resolved') {
    return res.status(404).json({ message: 'Problem not found or already resolved' });
  }
  const hasAlreadyApplied = curUser.applications.some(
    (application) => application.problemId.toString() === problemId
  );
  if (hasAlreadyApplied) {
    return res.status(400).json({ message: 'You have already applied to this problem' });
  }
  curUser.applications.push({
    userId: userId,
    problemId: problemId,
  });
  await curUser.save();
  res.status(200).json({ success: true, message: 'Applied to problem successfully' });
});

//Getting application details
exports.getUserProblemDetails = catchAsyncErrors(async (req, res, next) => {
  const { userId, problemId } = req.body;
  const curUser = await User.findById(req.user.id);
  const user = await User.findById(userId).select('name avatar problems');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const problem = user.problems.find(p => p._id.toString() === problemId);
  if (!problem) {
    // Remove the application from the current user's applications
    curUser.applications = curUser.applications.filter(app => app.problemId !== problemId);
    await curUser.save(); // Save the updated user
    return res.status(200).json({ success: true, message: 'Application removed, problem not found' });
  }

  res.status(200).json({
    success: true,
    application: {
      id: user._id,
      problemId: problem._id,
      name: user.name,
      avatar: user.avatar,
      problem: problem.problem,
      preferredSkills: problem.preferredHelperSkills,
    }
  });
});

// Add notification to seeker
exports.addNotification = catchAsyncErrors(async (req, res, next) => {
  const { seekerId, problemId ,type } = req.body;

  const helperId = req.user.id;
  const seeker = await User.findById(seekerId);

  if (!seeker) {
    return next(new ErrorHandler('Seeker not found', 404));
  }
  const notificationExists = seeker.notifications.some(
    notification =>
      notification.helperId.toString() === helperId.toString() &&
      notification.problemId.toString() === problemId.toString()
  );

  if (notificationExists) {
    return;
  }
  const newNotification = {
    helperId,
    problemId,
    type
  };

  seeker.notifications.push(newNotification);
  await seeker.save();

  res.status(200).json({
    success: true,
    message: 'Notification sent to seeker',
  });
});

// Add notification to seeker
exports.addNotificationHelper = catchAsyncErrors(async (req, res, next) => {
  const { helperId, problemId,type } = req.body;
  const seekerId = req.user.id;
  const helper = await User.findById(helperId);

  if (!helper) {
    return next(new ErrorHandler('Helper not found', 404));
  }
  const notificationExists = helper.notifications.some(
    notification =>
      notification.seekerId.toString() === seekerId.toString() &&
      notification.problemId.toString() === problemId.toString()
  );

  if (notificationExists) {
    return;
  }
  helper.notifications.push({
    seekerId,
    problemId,
    type
  });

  await helper.save();

  res.status(200).json({
    success: true,
    message: 'Notification sent to seeker',
  });
});



// Controller to fetch notifications with helper and problem details
exports.getNotificationsWithDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'notifications.helperId',
      select: 'name avatar'
    })
    .populate({
      path: 'notifications.seekerId',
      select: 'name avatar'
    });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const notifications = [];
  for (let notification of user.notifications) {
    const helper = notification.helperId;
    const seeker = notification.seekerId;
    let problem=null;
    if (helper) {
      problem = user.problems.find(p => p._id.toString() === notification.problemId.toString());
    }
    else if (seeker) {
      const seekerUser = await User.findById(seeker);
      problem = seekerUser.problems.find(p => p._id.toString() === notification.problemId.toString());
    }
    
    if (!problem && (helper || seeker)) {
      await User.updateOne(
        { _id: req.user.id },
        { $pull: { notifications: { _id: notification._id } } }
      );
      continue;
    }

    if(!helper && !seeker){
      notifications.push({
        message : notification.message
      })
    }

    if (helper) {
      notifications.push({
        _id: notification._id,
        helperId: helper._id,
        helperName: helper.name,
        helperAvatar: helper.avatar,
        problemId: problem._id,
        problem: problem.problem,
        createdAt: notification.createdAt,
        type: notification.type
      });
    }

    if (seeker) {
      notifications.push({
        _id: notification._id,
        seekerId: seeker._id,
        seekerName: seeker.name,
        seekerAvatar: seeker.avatar,
        problemId: problem._id,
        problem: problem.problem,
        createdAt: notification.createdAt,
        type: notification.type
      });
    }
  }

  res.status(200).json({
    success: true,
    notifications,
  });
});

// Decline notification and handle rejection -- seeker
exports.deleteNotification = catchAsyncErrors(async (req, res, next) => {
  const { notificationId } = req.body;
  const seeker = req.user;

  const removedNotificationIndex = seeker.notifications.findIndex(
    notification => notification._id.toString() === notificationId.toString()
  );

  if (removedNotificationIndex === -1) {
    return next(new ErrorHandler('Notification not found', 404));
  }
  const removedNotification = seeker.notifications[removedNotificationIndex];
  seeker.notifications.splice(removedNotificationIndex, 1);

  await seeker.save();
  const { helperId, problemId } = removedNotification;

  const helper = await User.findById(helperId);
  if (!helper) {
    return next(new ErrorHandler('Helper not found', 404));
  }
  helper.notifications.push({
    seekerId: seeker._id,
    problemId,
    type:"reject"
  });

  const application = helper.applications.find(
    app => app.problemId.toString() === problemId.toString()
  );
  if (application) {
    application.status = 'rejected';
  }

  await helper.save();

  res.status(200).json({
    success: true,
  });
});

//Update User Role --Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
  });
});

//Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  //remove cloudinary later
  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with Id: ${req.params.id}`));
  }
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully!!"
  });
});

//Get all users --Admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users
  });
});

//sending notification  -- Admin
exports.sendNotification = catchAsyncErrors(async (req, res, next) => {
  const { message, userIds, type } = req.body;
  
  if (!type) {
    return res.status(400).json({ message: 'Notification type is required' });
  }

  let users;

  if (type === 'allHelpers') {
      users = await User.find({ role: 'Helper' });
  } else if (type === 'allSeekers') {
      users = await User.find({ role: 'Seeker' });
  } else if (type === 'allUsers') {
      users = await User.find({});
  } else if (Array.isArray(userIds) && userIds.length) {
      users = await User.find({ _id: { $in: userIds } });
  } else {
      return res.status(400).json({ message: 'Invalid type or userIds' });
  }

  const notificationPromises = users.map(async (user) => {
      const newNotification = {
          createdAt: Date.now(),
          message,
          type,
          seekerId: undefined,
          helperId: undefined,
          problemId: undefined,
      };
      
      user.notifications.push(newNotification);

      await user.save();
  });

  await Promise.all(notificationPromises);

  res.status(200).json({ message: 'Notifications sent successfully' });
});