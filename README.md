# AidBridge

AidBridge is a platform designed to connect people in need (Seekers) with those who can help (Helpers). It aims to foster community support by matching seekers with helpers based on specific skills and needs.

This site is live on: https://aidbridgemernproject-frontend.onrender.com

## Table of Contents

- [Features](#features)
  - [User Management](#user-management)
  - [Problem Posting and Management](#problem-posting-and-management)
  - [Notification System](#notification-system)
  - [Chat System](#chat-system)
  - [Admin Functionalities](#admin-functionalities)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Features

### User Management

- *User Roles:* Users can register as either a Seeker or a Helper.
- *Profile Creation:* Users can create and manage their profiles, including personal details, location, and skills.
- *Authentication:* Secure user authentication with JWT.
- *Avatar Upload:* Users can upload an avatar to personalize their profiles.

### Problem Posting and Management

- *Post Problems:* Seekers can post problems they need help with.
- *View Problems:* Helpers can browse through a list of problems and offer help.
- *Application Tracking:* Helpers can view and manage the problems they have applied for.

### Notification System

- *Notifications:* Users receive notifications for important events (e.g., application requests, application rejections).
- *Admin Notifications:* Admins can send notifications to all users or specific groups (Seekers, Helpers).

### Chat System

- *Real-Time Chat:* Users can chat in real-time to discuss the problems and provide assistance.
- *Chat History:* Users can view their chat history for each problem.

### Admin Functionalities

- *User Management:* Admins can view, edit and delete user accounts.
- *Notification Management:* Admins can send platform-wide notifications or announcements.

## Installation

1. *Clone the repository:*

   bash
   git clone https://github.com/yourusername/AidBridge.git
   cd AidBridge
   

2. *Install dependencies:*

   bash
   npm install
   cd frontend
   npm install
   

3. *Configure environment variables:*

   Create a .env file in the root directory and add the following:

   PORT,DB_URI,JWT_SECRET,JWT_EXPIRE,COOKIE_EXPIRE,SMTP_SERVICE,SMTP_MAIL,SMTP_PASSWORD,SMTP_HOST,SMTP_PORT,CLOUDINARY_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET

   

4. *Start the development server:*

   bash
   npm run dev
   

## Usage

- *Register:* Create an account as a Seeker or Helper.
- *Profile Setup:* Complete your profile with personal details, location, and skills.
- *Post/Apply for Problems:* Seekers can post problems, and Helpers can apply to solve them.
- *Chat and Notifications:* Use the chat system for communication and receive notifications for updates.

## Technologies Used

- *Frontend:*
  - React
  - Redux
  - React Router
  - Axios
  - Material-UI
  - CSS

- *Backend:*
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT
  - Cloudinary
  - Socket.IO

- *Other:*
  - REST API
  - WebSockets

