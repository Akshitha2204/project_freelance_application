import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/MyApplications.css';
import axios from 'axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      const apps = response.data.reverse();
      setApplications(apps);
      setFilteredApplications(apps);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term) {
      setFilteredApplications(applications.filter(app => app.title.toLowerCase().includes(term)));
    } else {
      setFilteredApplications(applications);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="user-applications-page">
      <div className="header">
        <h3>My Applications</h3>
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search by title..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
      <div className="user-applications-body">
        {filteredApplications.filter(app => app.freelancerId === localStorage.getItem('userId')).map((application) => (
          <div className="user-application-card" key={application._id}>
            <div className="user-application-header">
              <h4>{application.title}</h4>
              <p className="status">{application.status}</p>
            </div>
            <p className="description">{application.description}</p>
            <div className="application-section">
              <h5>Required Skills:</h5>
              <div className="skills-list">
                {application.requiredSkills.map((skill) => (
                  <span key={skill} className="skill">{skill}</span>
                ))}
              </div>
            </div>
            <h6 className="budget">Budget: &#8377; {application.budget}</h6>
            <div className="application-section">
              <h5>Proposal</h5>
              <p className="proposal">{application.proposal}</p>
            </div>
            <div className="application-section">
              <h5>Freelancer Skills:</h5>
              <div className="skills-list">
                {application.freelancerSkills.map((skill) => (
                  <span key={skill} className="skill">{skill}</span>
                ))}
              </div>
            </div>
            <h6 className="budget">Proposed Budget: &#8377; {application.bidAmount}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
