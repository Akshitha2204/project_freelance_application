import React, { useEffect, useState } from 'react';
import '../../styles/client/ClientApplications.css';
import axios from 'axios';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      const userApplications = response.data.filter(application => application.clientId === localStorage.getItem('userId'));
      setApplications(userApplications);
      setDisplayApplications(userApplications.reverse());
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.get(`http://localhost:6001/approve-application/${id}`);
      alert("Application approved");
      fetchApplications();
    } catch (err) {
      alert("Operation failed!!");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`http://localhost:6001/reject-application/${id}`);
      alert("Application rejected!!");
      fetchApplications();
    } catch (err) {
      alert("Operation failed!!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const filteredApplications = applications.filter(application =>
      application.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayApplications(filteredApplications);
  }, [searchTerm, applications]);

  return (
    <div className="user-applications-page">
      <div className="header">
        <h3>My Applications</h3>
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search by title..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
      </div>
      <div className="user-applications-body">
        {displayApplications.map((application) => (
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
            <div className="application-footer">
              <h6>Budget: &#8377; {application.budget}</h6>
              <h6>Proposed Budget: &#8377; {application.bidAmount}</h6>
            </div>
            <div className="application-proposal">
              <h5>Proposal</h5>
              <p>{application.proposal}</p>
            </div>
            {application.status === 'Pending' && (
              <div className="approve-btns">
                <button className="btn btn-success" onClick={() => handleApprove(application._id)}>Approve</button>
                <button className="btn btn-danger" onClick={() => handleReject(application._id)}>Decline</button>
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectApplications;



