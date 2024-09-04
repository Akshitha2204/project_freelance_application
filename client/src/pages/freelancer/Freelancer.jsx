import React, { useEffect, useState } from 'react';
import '../../styles/freelancer/freelancer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Freelancer = () => {
  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false);
  const navigate = useNavigate();
  const [freelancerData, setFreelancerData] = useState();
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [applicationsCount, setApplicationsCount] = useState([]);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetchUserData(userId);
    fetchApplications(userId);
    fetchCompletedProjects(userId);
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-freelancer/${id}`);
      const data = response.data;
      if (data) {
        setFreelancerData(data);
        setFreelancerId(data._id);
        setSkills(data.skills);
        setDescription(data.description);
        setUpdateSkills(data.skills.join(', ')); // Assuming skills are an array of strings
        setUpdateDescription(data.description);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUserData = async () => {
    try {
      await axios.post(`http://localhost:6001/update-freelancer`, {
        freelancerId,
        skills: updateSkills.split(',').map(skill => skill.trim()), // Assuming skills are input as a comma-separated string
        description: updateDescription
      });
      fetchUserData(freelancerId);
      setIsDataUpdateOpen(false);
      alert('User data updated');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const fetchApplications = async (userId) => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      const data = response.data;
      const filteredApplications = data.filter(application => application.freelancerId === userId);
      setApplicationsCount(filteredApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchCompletedProjects = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-completed-projects/${userId}`);
      const data = response.data;
      setCompletedProjectsCount(data.length);
    } catch (error) {
      console.error('Error fetching completed projects:', error);
    }
  };

  return (
    <>
      {freelancerData &&
        <div className="freelancer-home">
          <div className="home-card">
            <h4>Current projects</h4>
            <p>{freelancerData.currentProjects.length}</p>
          </div>
          <div className="home-card">
            <h4>Completed projects</h4>
            <p>{completedProjectsCount}</p>
          </div>
          <div className="home-card">
            <h4>Applications</h4>
            <p>{applicationsCount.length}</p>
          </div>
          <div className="home-card">
            <h4>Funds</h4>
            <p>Available: &#8377; {freelancerData.funds}</p>
            {/* <button>Withdraw</button> */}
          </div>
          <div className="freelancer-details">
            {!isDataUpdateOpen ?
              <div className="freelancer-details-data">
                <span>
                  <h4>Skills</h4>
                  <div className="skills">
                    {skills.map((skill, index) => (
                      <h5 className='skill' key={index}>{skill}</h5>
                    ))}
                    {skills.length === 0 &&
                      <p>No skills available</p>
                    }
                  </div>
                </span>
                <span>
                  <h4>Description</h4>
                  {description ? <p>{description}</p> : <p>Please add your description</p>}
                </span>
                <button className='btn btn-success' onClick={() => setIsDataUpdateOpen(true)}>Update</button>
              </div>
              :
              <div className="freelancer-details-update">
                <h4>Update details</h4>
                <textarea className='form-control' value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} placeholder="Add a description"></textarea>
                <textarea className='form-control' value={updateSkills} onChange={(e) => setUpdateSkills(e.target.value)} placeholder="Add skills"></textarea>
                <button className='btn btn-success mt-2' onClick={updateUserData}>Save</button>
                <button className='btn btn-outline-danger mt-2' onClick={() => setIsDataUpdateOpen(false)}>Cancel</button>
              </div>
            }
          </div>
        </div>
      }
    </>
  );
}

export default Freelancer;