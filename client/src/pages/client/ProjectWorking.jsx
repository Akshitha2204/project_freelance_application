import React, { useContext, useEffect, useState } from 'react';
import '../../styles/client/ProjectWorking.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();

  const [project, setProject] = useState();
  const [clientId, setClientId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params['id']);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState();
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
  }, []);

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: params['id'], freelancerId: "" });
  };

  useEffect(() => {
    fetchProject(params['id']);
  }, []);

  const fetchProject = async (id) => {
    await axios.get(`http://localhost:6001/fetch-project/${id}`).then(
      (response) => {
        setProject(response.data);
        setProjectId(response.data._id);
        setClientId(response.data.clientId);
      }
    ).catch((err) => {
      console.log(err);
    });
  };

  const handleApproveSubmission = async () => {
    await axios.get(`http://localhost:6001/approve-submission/${params['id']}`).then(
      (response) => {
        fetchProject(params['id']);
        alert("Submission approved!!");
      }
    ).catch((err) => {
      console.log(err);
    });
  };

  const handleRejectSubmission = async () => {
    await axios.get(`http://localhost:6001/reject-submission/${params['id']}`).then(
      (response) => {
        fetchProject(params['id']);
        alert("Submission rejected!!");
      }
    ).catch((err) => {
      console.log(err);
    });
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", { projectId: params['id'], senderId: localStorage.getItem("userId"), message, time: new Date() });
    setMessage("");
    fetchChats();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`).then(
      (response) => {
        setChats(response.data);
      }
    );
  };

  useEffect(() => {
    socket.on("message-from-user", () => {
      fetchChats();
    });
  }, [socket]);

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <>
      {project ? (
        <div className="project-data-page">
          <div className="project-data-container">
            <div className="project-data">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span>
                <h5><strong>Required skills</strong></h5>
                <div className="required-skills">
                  {project.skills.map((skill) => (
                    <p key={skill}>{skill}</p>
                  ))}
                </div>
              </span>
              <span>
                <h5><strong>Budget</strong></h5>
                <h6>&#8377; {project.budget}</h6>
              </span>
            </div>

            {project.freelancerId && project.freelancerId !== "" && (
              <div className="project-submissions-container">
                <h4>Submission</h4>
                <div className="project-submissions">
                  {project.submission ? (
                    <div className="project-submission">
                      <span>
                        <h5>Project Link: </h5>
                        <a href={project.projectLink} target='_blank'>{project.projectLink}</a>
                      </span>
                      <span>
                        <h5>Manual Link: </h5>
                        <a href={project.manulaLink} target='_blank'>{project.manulaLink}</a>
                      </span>
                      <h5>Description for work</h5>
                      <p>{project.submissionDescription}</p>
                      {project.submissionAccepted ? (
                        <h5 style={{ color: "green" }}>project completed!!</h5>
                      ) : (
                        <div className="submission-btns">
                          <button className='btn btn-success' onClick={handleApproveSubmission}>Approve </button>
                          <button className='btn btn-danger' onClick={handleRejectSubmission}>Reject</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p><i>No submissions yet!</i></p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="chat-toggle-button" onClick={toggleChatVisibility}>
            {isChatVisible ? "Hide Chat" : "Show Chat"}
          </button>

          {isChatVisible && (
            <div className="project-chat-container">
              <h4><b><i>Chat with the Freelancer</i></b></h4>
              <hr />
              {project.freelancerId ? (
                <div className="chat-body">
                  {chats ? (
                    <div className="chat-messages">
                      {chats.messages.map((message) => (
                        <div className={message.senderId === localStorage.getItem("userId") ? "my-message" : "received-message"} key={message.id}>
                          <div>
                            <p>{message.text}</p>
                            <h6>{message.time.slice(5, 10)} - {message.time.slice(11, 19)}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : ""}

                  <div className="chat-input">
                    <input type="text" className='form-control' placeholder='Enter message' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={handleMessageSend}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <i style={{ color: '#938f8f' }}>Chat will be enabled once the project is assigned to you!</i>
              )}
            </div>
          )}
        </div>
      ) : ""}
    </>
  );
};

export default ProjectWorking;

