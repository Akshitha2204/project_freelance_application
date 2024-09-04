import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../../styles/admin/adminpage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Admin = () => {
  const navigate = useNavigate();
  const [projectsCount, setProjectsCount] = useState(0);
  const [completedProsCount, setCompletedProsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchApplications();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    await axios
      .get('http://localhost:6001/fetch-projects')
      .then((response) => {
        setProjectsCount(response.data.length);
        const comPros = response.data.filter((pro) => pro.status === 'Completed');
        setCompletedProsCount(comPros.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchApplications = async () => {
    await axios
      .get('http://localhost:6001/fetch-applications')
      .then((response) => {
        setApplicationsCount(response.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsers = async () => {
    await axios
      .get('http://localhost:6001/fetch-users')
      .then((response) => {
        setUsersCount(response.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const calculateFreelancers = () => {
    // Implement logic to count freelancers
    return Math.floor(usersCount / 3); // Example logic, adjust as per your data structure
  };

  const calculateClients = () => {
    // Implement logic to count clients
    return Math.floor(usersCount / 3); // Example logic, adjust as per your data structure
  };

  const calculateAdmins = () => {
    // Implement logic to count admins
    return usersCount - calculateFreelancers() - calculateClients(); // Example logic, adjust as per your data structure
  };

  const projectData = {
    labels: ['Completed Projects', 'Incomplete Projects'],
    datasets: [
      {
        label: '# of Projects',
        data: [completedProsCount, projectsCount - completedProsCount],
        backgroundColor: ['#1976d2', '#0d47a1'], // Darker shades of blue
        hoverBackgroundColor: ['#1976d2', '#1976d2'], // Slightly lighter shades for hover effect
      },
    ],
  };

  const applicationData = {
    labels: ['Applications'],
    datasets: [
      {
        label: '# of Applications',
        data: [applicationsCount],
        backgroundColor: ['#1976d2'], // Darker shade of blue
        hoverBackgroundColor: ['#1976d2'], // Slightly lighter shade for hover effect
      },
    ],
  };

  const userData = {
    labels: ['Freelancer', 'Client', 'Admin'],
    datasets: [
      {
        label: '# of Users',
        data: [calculateFreelancers(), calculateClients(), calculateAdmins()],
        backgroundColor: ['#1976d2', '#0d47a1', '#0a3251'], // Darker shades of blue
        hoverBackgroundColor: ['#1976d2', '#1565c0', '#0d47a1'], // Slightly lighter shades for hover effect
      },
    ],
  };

  return (
    <div className="admin-page">
      
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-item">
            <h4>All Projects</h4>
            <p>{projectsCount}</p>
            <Pie data={projectData} />
          </div>
          <div className="stat-item">
            <h4>Completed Projects</h4>
            <p>{completedProsCount}</p>
            <Pie data={projectData} />
          </div>
          <div className="stat-item">
            <h4>Applications</h4>
            <p>{applicationsCount}</p>
            <Pie data={applicationData} />
          </div>
          <div className="stat-item">
            <h4>Users</h4>
            <p>{usersCount}</p>
            <Pie data={userData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
