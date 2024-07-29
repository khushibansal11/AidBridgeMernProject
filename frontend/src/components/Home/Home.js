import React from 'react';
import Navbar from '../Layout/Navbar';
import About from './About.js';
import './Home.css';
import shortLogo from "../../images/shortLogo.jpg";
import Contact from './Contact.js';
import Footer from '../Layout/Footer.js';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="main-area" id='home-section'>
        <div className="home-section" >
          <div className="websiteName">
            <img src={shortLogo} alt="Logo" />
            AidBridge
          </div>
          <div className="slogan">
            Your Bridge to Local Help and Support
          </div>
        </div>
      </div>
      <div id="about-section">
        <About />
      </div>
      <div id="contact-section">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
