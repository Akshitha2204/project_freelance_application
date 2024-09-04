import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faGooglePlus, faYoutube } from '@fortawesome/free-brands-svg-icons';
import '../styles/landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const aboutUsRef = useRef(null);

  const scrollToAboutUs = () => {
    if (aboutUsRef.current) {
      window.scrollTo({
        top: aboutUsRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="landing-page">
      {/* Landing Hero Section */}
      <section className="landing-hero">
        {/* Navigation */}
        <nav className="landing-nav">
          <h1>t h r i v e</h1>
          <div className="nav-buttons">
            <button onClick={() => navigate('/authenticate')}>Sign In</button>
            <button onClick={scrollToAboutUs}>About Us</button>
          </div>
        </nav>
        
        {/* Hero Text */}
        <div className="landing-hero-text">
        </div>
      </section>

 

      {/* About Us Section */}
      <section ref={aboutUsRef} className="about-us-section">
        <div className="about-us-container">
          <h2>About Us</h2>
          <p>Welcome to Thrive, where opportunities meet talent.
            At Thrive, our mission is to empower freelancers and clients
             alike by providing a dynamic platform where
             freelancers can showcase their skills and find exciting new gigs, and where clients can discover talented
              individuals to bring their projects to life.</p>
        </div>
      </section>

           {/* New Section */}
      <section className="services-section">
        <center><h1>Services</h1></center>
        <div className="services-container">
          
          <div className="client-section">
            <h2>Client</h2>
            <p>✔ Find the talent you need</p>
            <p>✔ Post jobs & get proposals</p>
            <p>✔ Manage your projects</p>
          </div>
          <div className="freelancer-section">
            <h2>Freelancer</h2>
            <p>✔ Search millions of jobs</p>
            <p>✔ Submit applications</p>
            <p>✔ Chat with the client</p>
          </div>
        </div>
      </section>



      {/* Footer Section */}
      <footer>
        
        <div className="footerContainer">
          <div className="socialIcons">
            <p><center>thrive.com</center></p>
            <a href="https://www.facebook.com"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="https://www.instagram.com"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://www.twitter.com"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="https://www.google.com"><FontAwesomeIcon icon={faGooglePlus} /></a>
            <a href="https://www.youtube.com"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
</div>
      </footer>
    </div>
  );
};

export default Landing;


