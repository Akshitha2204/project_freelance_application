import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/freelancer/AllProjects.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [displayprojects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      const fetchedProjects = response.data.reverse();
      setProjects(fetchedProjects);
      setDisplayProjects(fetchedProjects);

      const skillsSet = new Set();
      fetchedProjects.forEach((project) => {
        project.skills.forEach((skill) => {
          skillsSet.add(skill);
        });
      });
      setAllSkills(Array.from(skillsSet));
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Consider handling the error, e.g., displaying a message to the user
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCategoryFilter([...categoryFilter, value]);
    } else {
      setCategoryFilter(categoryFilter.filter((size) => size !== value));
    }
  };

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        projects.filter((project) =>
          categoryFilter.every((skill) => project.skills.includes(skill))
        )
      );
    } else {
      setDisplayProjects(projects);
    }
  }, [categoryFilter, projects]);

  const clearFilters = () => {
    setCategoryFilter([]);
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  return (
    <div className="all-projects-container">
      <div className="project-filters">
        <h3>Filters</h3>
        <hr />
        <div className="filters">
          <h5>Skills</h5>
          {allSkills.length > 0 && (
            <div className="filter-options">
              {allSkills.map((skill) => (
                <div className="form-check" key={skill}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={skill}
                    id={`skill-${skill}`}
                    onChange={handleCategoryCheckBox}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`skill-${skill}`}
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>
      <div className="projects-list">
        <h3>All projects</h3>
        {displayprojects.map((project) => (
          <div className="listed-project" key={project._id}>
            <div className="listed-project-head">
              <h3>{project.title}</h3>
            </div>
            <h5>Budget &#8377; {project.budget}</h5>
            <h5>Client name: {project.clientName}</h5>
            <h5>Client email: {project.clientEmail}</h5>
            <p>{project.description}</p>
            <div className="skills">
              {project.skills.map((skill) => (
                <h6 key={skill}>{skill}</h6>
              ))}
            </div>
            <div className="bids-data">
              <p>{project.bids.length} bids</p>
              <h6>
                &#8377;{' '}
                {project.bids.length > 0
                  ? project.bidAmounts.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue,
                      0
                    )
                  : 0}{' '}
                (avg bid)
              </h6>
            </div>
            <h5>Status - {project.status}</h5>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;


