import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/freelancer/MyProjects.css';

const MyProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      const pros = response.data.filter(
        (pro) => pro.freelancerId === localStorage.getItem('userId')
      );
      setProjects(pros);
      setDisplayProjects(pros.slice().reverse());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false); // stop loading even if there's an error
    }
  };

  const handleFilterChange = (status) => {
    if (status === "") {
      setDisplayProjects(projects.slice().reverse());
    } else {
      const filteredProjects = projects
        .filter((project) => {
          if (status === "In Progress") return project.status === "Assigned";
          if (status === "Completed") return project.status === "Completed";
          return true;
        })
        .reverse();
      setDisplayProjects(filteredProjects);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="my-projects-page">
      <div className="my-projects-header">
        <h3>My Projects</h3>
        <select
          className="form-control"
          placeholder="Project status"
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">Choose project status</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <hr />
      <div className="my-projects-list">
        {displayProjects.length > 0 ? (
          displayProjects.map((project) => (
            <div
              className="project-card"
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="project-card-head">
                <h3>{project.title}</h3>
                <p>{formatDate(project.postedDate)}</p>
              </div>
              <h5>Budget - &#8377; {project.budget}</h5>
              <p>{project.description}</p>
              <div className="project-status">
                <h6>Status - {project.status}</h6>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </div>
  );
};

export default MyProjects;