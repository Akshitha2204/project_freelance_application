import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/freelancer/ProjectData.css';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();

  const [project, setProject] = useState();
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params['id']);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState();

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
  }, []);

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: params['id'], freelancerId: localStorage.getItem("userId") });
  };

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

  const handleBidding = async () => {
    await axios.post("http://localhost:6001/make-bid", { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime }).then(
      (response) => {
        setProposal('');
        setBidAmount(0);
        setEstimatedTime(0);
        alert("Bidding successful!!");
      }
    ).catch((err) => {
      alert("Bidding failed!! Try again!");
    });
  };

  const handleProjectSubmission = async () => {
    await axios.post("http://localhost:6001/submit-project", { clientId, freelancerId, projectId, projectLink, manualLink, submissionDescription }).then(
      (response) => {
        setProjectLink('');
        setManualLink('');
        setSubmissionDescription('');
        alert("Submission successful!!");
      }
    ).catch((err) => {
      alert("Submission failed!! Try again!");
    });
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", { projectId: params['id'], senderId: localStorage.getItem("userId"), message, time: new Date() });
    fetchChats();
    setMessage("");
  };

  const fetchChats = async () => {
    await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`).then(
      (response) => {
        setChats(response.data);
      }
    );
  };

  useEffect(() => {
    fetchChats();
  }, []);

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
      {project ?
        <div className="project-data-page">
          <div className="project-data-container">
            <div className="project-data">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span>
                <h5>Required skills</h5>
                <div className="required-skills">
                  {project.skills.map((skill) => (
                    <p key={skill}>{skill}</p>
                  ))}
                </div>
              </span>
              <span>
                <h5>Budget</h5>
                <h6>&#8377; {project.budget}</h6>
              </span>
            </div>

            {/* Freelancer proposal */}
            {project.status === "Available" ?
              <div className="project-form-body">
                <h4>Send proposal</h4>
                <span>
                  <div className="form-floating">
                    <input type="number" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                    <label htmlFor="floatingPassword">Budget</label>
                  </div>
                  <div className="form-floating">
                    <input type="number" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
                    <label htmlFor="floatingPassword">Estimated time (days)</label>
                  </div>
                </span>
                <div className="form-floating">
                  <textarea className="form-control mb-3" id="floatingPassword" placeholder="Password" value={proposal} onChange={(e) => setProposal(e.target.value)} />
                  <label htmlFor="floatingPassword">Describe your proposal</label>
                </div>
                {!project.bids.includes(localStorage.getItem('userId')) ? <button className='btn btn-success' onClick={handleBidding} >Post Bid</button> : ""}
                {project.bids.includes(localStorage.getItem('userId')) ? <button className='btn btn-primary' disabled >Already bidded</button> : ""}
              </div>
              : ""}
            {project.freelancerId === localStorage.getItem('userId') ?
              <div className="project-form-body">
                <h4>Submit the project</h4>
                {project.submissionAccepted ?
                  <p>Project completed</p>
                  :
                  <>
                    <div className="form-floating">
                      <input type="text" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
                      <label htmlFor="floatingPassword">Project link</label>
                    </div>
                    <div className="form-floating">
                      <input type="text" className="form-control mb-3" id="floatingPassword" placeholder="Password" value={manualLink} onChange={(e) => setManualLink(e.target.value)} />
                      <label htmlFor="floatingPassword">Manual link</label>
                    </div>
                    <div className="form-floating">
                      <textarea className="form-control mb-3" id="floatingPassword" placeholder="Password" value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} />
                      <label htmlFor="floatingPassword">Describe your work</label>
                    </div>
                    {project.submission ?
                      <button className="btn btn-secondary" disabled >Already submitted</button>
                      :
                      <button className="btn btn-success" onClick={handleProjectSubmission} >Submit project</button>
                    }
                  </>
                }
              </div>
              : ""}
          </div>
          <button className="chat-toggle-button" onClick={toggleChatVisibility}>
            {isChatVisible ? "Hide Chat" : "Show Chat"}
          </button>
          {isChatVisible && (
            <div className="project-chat-container">
              <h4><b>Chat with the client</b></h4>
              <hr />
              {project.freelancerId === localStorage.getItem('userId') ?
                <div className="chat-body">
                  {chats ?
                    <div className="chat-messages">
                      {chats.messages.map((message) => (
                        <div className={message.senderId === localStorage.getItem("userId") ? "my-message" : "received-message"} key={message.id}>
                          <div>
                            <p>{message.text}</p>
                            <h6>{message.time.slice(11, 19)}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                    : ""}
                  <div className="chat-input">
                    <input type="text" className='form-control' placeholder='Enter message' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={handleMessageSend}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                      </svg>
                    </button>
                  </div>
                </div>
                :
                <i style={{ color: '#938f8f' }}>Chat will be enabled once the project is assigned to you!</i>
              }
            </div>
          )}
        </div>
        : ""}
    </>
  );
};

export default ProjectData;
