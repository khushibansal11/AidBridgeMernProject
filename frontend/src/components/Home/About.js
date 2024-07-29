import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About AidBridge</h1>
      <p>
        Welcome to AidBridge, your dedicated platform for connecting those in need with those who can help. Our mission is to build a supportive community where people can easily find and offer assistance, making local help accessible and reliable.
      </p>
      
      <h2>Our Mission</h2>
      <p>
        Our mission is to create a bridge between individuals who need help and those who are willing to provide it. Whether it's a small task or a significant challenge, AidBridge aims to facilitate meaningful connections that lead to positive outcomes.
      </p>

      <h2>Our Vision</h2>
      <p>
        We envision a world where everyone has access to the help they need, whenever they need it. By fostering a community of helpers and seekers, we strive to make support more accessible, reliable, and efficient for all.
      </p>

      <h2>How It Works</h2>
      <ol>
        <li><strong>Sign Up:</strong> Create an account and choose your role - whether you're looking for help or offering assistance.</li>
        <li><strong>Post or Find Requests:</strong> Helpers can browse through requests for assistance, while seekers can post their needs for others to see.</li>
        <li><strong>Connect:</strong> Communicate through our secure messaging system to arrange details and provide help.</li>
        <li><strong>Rate and Review:</strong> After the assistance is provided, both parties can leave ratings and reviews to build trust within the community.</li>
      </ol>

      <h2>Benefits of Using AidBridge</h2>
      <ul>
        <li><strong>Trusted Community:</strong> Our platform ensures that all users are verified, fostering a safe and trustworthy environment.</li>
        <li><strong>Easy to Use:</strong> With a user-friendly interface, finding and offering help is straightforward and efficient.</li>
        <li><strong>Local Focus:</strong> We prioritize local connections, making it easier for users to find assistance nearby.</li>
        <li><strong>Secure Communication:</strong> Our built-in messaging system ensures privacy and security for all interactions.</li>
      </ul>

      <h2>Join Us</h2>
      <p>
        Be a part of the AidBridge community today. Whether you're looking to offer your skills and time or you need a helping hand, AidBridge is here to connect you with the right people. Together, we can make a difference, one connection at a time.
      </p>
    </div>
  );
}

export default About;
