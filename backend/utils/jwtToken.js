// Create Token and saving in cookie
const sendToken = (user, statusCode, res) => {
  try {
    const token = user.getJWTToken();
    
    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false
    };
    
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = sendToken;
