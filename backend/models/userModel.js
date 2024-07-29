const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        required: [true, "Please Describe your Role"],
        enum: ['Helper', 'Seeker', 'admin'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    problems: [
        {
            problem: {
                type: String,
                default: "",
                required: true,
            },
            preferredHelperSkills: {
                type: [String],
                default: [],

            },
            status: {
                type: String,
                default: "pending",
                enum: ['pending', 'resolved']
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    skills: {
        type: [String],
        default: [],
        required: function () {
            return this.role === 'helper';
        },
    },
    availability: {
        type: String,
        default: "Full-time",
        required: function () {
            return this.role === 'helper';
        },
    },
    ratings: {
        type: Number,
        default: 0,
        required: function () {
            return this.role === 'helper';
        },
    },
    numOfReviews: {
        type: Number,
        default: 0,
        required: function () {
            return this.role === 'helper';
        },
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            avatar: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    location: {
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        latitude: {
            type: Number,
            default: 0
        },
        longitude: {
            type: Number,
            default: 0
        }
    },
    phoneNo: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v.toString());  // Ensure exactly 10 digits
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    bio: {
        type: String,
        default: ""
    },
    completeProfile: {
        type: Boolean,
        default: false
    },
    applications: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            problemId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Problem',
                required: true
            },
            status: {
                type: String,
                default: 'pending'
            },
            appliedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    notifications: [
        {
          createdAt: {
            type: Date,
            default: Date.now,
          },
          message:{
            type:String,
            default: "",
          },
          seekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          helperId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem',
          },
          type: {
            type: String,
            required: true,
          },
        }
      ],
      chats: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chat',
        },
      ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


//Encrypting users password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//compare passwords
userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);