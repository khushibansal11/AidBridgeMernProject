import React from 'react';
import './Footer.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="footer-logo">AidBridge</h2>
          <p>Your Bridge to Local Help and Support</p>
        </div>
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#about-section">About</a></li>
            <li><a href="#contact-section">Contact</a></li>
            <li><a href="#services-section">Services</a></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h2>Follow Me</h2>
          <div className="social-links">
            <a href="https://www.instagram.com/khushii_bansall/"><InstagramIcon /></a>
            <a href="https://www.linkedin.com/in/khushi-bansal-865170243/"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} AidBridge | All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
