import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin/allApplications.css';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      setApplications(response.data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user-applications-page">
      <h3>All Applications</h3>
      <div className="user-applications-body">
        {applications.map((application) => (
          <div className="user-application" key={application._id}>
            <div className="user-application-body">
              <div className="user-application-half">
                <h4>{application.title}</h4>
                <p>{application.description}</p>
                <div className="application-skills">
                  <h5><b>Required Skills</b></h5>
                  <div className="skills-list">
                    {application.requiredSkills.map((skill) => (
                      <span key={skill} className="skill">{skill}</span>
                    ))}
                  </div>
                </div>
                <h6>Budget: &#8377; {application.budget}</h6>
                <h5><b>Client:</b> {application.clientName}</h5>
                <h5><b>Client Id:</b> {application.clientId}</h5>
                <h5><b>Client email:</b> {application.clientEmail}</h5>
              </div>
              <div className="vertical-line"></div>
              <div className="user-application-half">
                <div className="proposal-section">
                  <h5>Proposal</h5>
                  <p>{application.proposal}</p>
                </div>
                <div className="application-skills">
                <h5><b>Freelancer Skills</b></h5>
                  <div className="skills-list">
                    {application.freelancerSkills.map((skill) => (
                      <span key={skill} className="skill">{skill}</span>
                    ))}
                  </div>
                </div>
                <h6>Proposed Budget: &#8377; {application.bidAmount}</h6>
                <h5><b>Freelancer:</b> {application.freelancerName}</h5>
                <h5><b>Freelancer Id:</b> {application.freelancerId}</h5>
                <h5><b>Freelancer email:</b> {application.freelancerEmail}</h5>
                <h6>Status: <b style={{ color: application.status === "Accepted" ? "green" : "inherit" }}>{application.status}</b></h6>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllApplications;
