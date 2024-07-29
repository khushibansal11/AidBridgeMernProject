import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../images/logo.jpg";
import './Navbar.css';

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    if (element) {
      window.scrollTo({
        top: element.offsetTop - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="AidBridge" />
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
          <button onClick={() => scrollToSection('home-section')} className="nav-links">
              Home
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('about-section')} className="nav-links">
              About
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('contact-section')} className="nav-links">
              Contact
            </button>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links">
              Sign In
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
