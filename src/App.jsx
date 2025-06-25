import { useState } from 'react'
import './App.css'
import axios from "axios"
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import logo from "./assets/logo4.png";
import boat from "./assets/boat.jpeg"

function Header() {
  return (
    <header className="header">
      <img className="header-img" src={boat} alt="Boat" />
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-icon" />
      </div>
    </header>
  )
}

function App() {
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    // email: '',
    // projectCode: '',
    department: '',
    team: '',
    priority: '',
    severity: '',
    projectTitle: '',
    description: '',
    fileUpload: null
  })

  const handleOtherUserClick = () => { setShowForm(true) }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const form = new FormData()
  form.append('email', email)
  form.append('projectCode', projectCode)
  form.append('department', formData.department)
  form.append('team', formData.team)
  form.append('priority', formData.priority)
  form.append('severity', formData.severity)
  form.append('projectTitle', formData.projectTitle)
  form.append('description', formData.description)

  if (formData.fileUpload) {
    form.append('fileUpload', formData.fileUpload)
  }

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault()
    // fetch(import.meta.env.VITE_BURL, { body: JSON.stringify(formData) , method: 'POST'} )
    const res = axios.post(import.meta.env.VITE_BURL + "/create-ticket", form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const data = await res
    setIsSubmitting(false);
    if (res) {
      toast.success("Ticket created with " + ` ticket Number is #${data.data.ticketNumber}`, {
        position: "top-right"
      });
    }

    setEmail([])
    setProjectCode([])
    setFormData({
      department: '',
      team: '',
      priority: '',
      severity: '',
      projectTitle: '',
      description: '',
      fileUpload: null
    })
  }

  const handleProjectCode = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BURL}/get-project-code`); // Replace with your API
      const res = await response.json();
      console.log(res)
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  // getting of email and name of user ------ start 
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([{}]);
  const [matchedEmails, setMatchedEmails] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BURL + "/get-users"); // Replace with your API
      const res = await response.json();
      setAllData(res.data);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const emails = allData.map((item) =>
    ({
      name: item.name || "",
      email: item.cf?.cf_email || "",
    })
    );
    setFilteredData(emails);
  }, [allData]);

  const handleClick = () => {
    if (!hasFetched) {
      fetchData();
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Filter emails as user types
    const matched = filteredData.filter((mail) =>
      mail.email.toLowerCase().includes(value.toLowerCase())
    );
    setMatchedEmails(matched);
  };

  const selectEmail = (selectedMail) => {
    setEmail(selectedMail);
    setMatchedEmails([]);
  };

  // end of  code of getting of email and name of user ------

  //  getting the project code ---------
  const [allProjectData, setAllProjectData] = useState([]);
  const [filteredProjectData, setFilteredProjectData] = useState([]);
  const [matchedProjectCodes, setMatchedProjectCodes] = useState([]);
  const [hasProjectsFetched, setHasProjectsFetched] = useState(false);


  const fetchProjectCode = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BURL + "/get-projectcode");
      const res = await response.json();
      setAllProjectData(res.data);
      setHasProjectsFetched(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    if (allProjectData && allProjectData.length > 0) {
      const data = allProjectData.map((item) => item.name); // or add filtering logic
      setFilteredProjectData(data);
    }
  }, [allProjectData]);

  const handleProjectCodeClick = () => {
    if (!hasProjectsFetched) {
      fetchProjectCode();
    }
  };

  const handleProjectCodeChange = (e) => {
    const value = e.target.value;
    setProjectCode(value);

    // Filter project codes as user types
    const matched = filteredProjectData.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setMatchedProjectCodes(matched);
  };

  const selectProjectCode = (selectedCode) => {
    setProjectCode(selectedCode);
    setMatchedProjectCodes([]);
  };


  // end of getting the project code ----------

  if (showForm) {
    return (
      <>
        <Header />
        <div className="app">
          <div className="container">
            <h1 style={{ fontSize: '2rem' }}>Create a Ticket</h1>

            <form className="user-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="email-autocomplete-container">
                  <p className="email-autocomplete-title">Your Email </p>

                  <input
                    type="email"
                    value={email}
                    name='email'
                    onClick={handleClick}
                    onChange={handleEmailChange}
                    placeholder="Enter email"
                    className="email-autocomplete-input"
                  />

                  {matchedEmails.length > 0 && (
                    <div className="email-autocomplete-dropdown">
                      {matchedEmails.map((mail, index) => (
                        <div
                          key={index}
                          onClick={() => selectEmail(mail.email)}
                          className="email-autocomplete-item"
                        >
                          <span className='email-autocomplete-name'>{mail.name}</span>
                          <br />
                          <span className='email-autocomplete-email' >{mail.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <div className="project-code-autocomplete-container">
                  <p className="project-code-autocomplete-title">Project Code <span style={{ color: "red" }}>*</span> </p>

                  <input
                    type="text"
                    value={projectCode}
                    name='projectCode'
                    onClick={handleProjectCodeClick}
                    onChange={handleProjectCodeChange}
                    placeholder="Enter project code"
                    className="project-code-autocomplete-input"
                    required
                  />

                  {matchedProjectCodes.length > 0 && (
                    <div className="project-code-autocomplete-dropdown">
                      {matchedProjectCodes.map((code, index) => (
                        <div
                          key={index}
                          onClick={() => selectProjectCode(code)}
                          className="project-code-autocomplete-item"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="department" style={{ display: "flex", alignItems: "center", gap: "1px" }}>
                  Team <span style={{ color: "red" }}>*</span>
                  <span className="tooltip-button">
                    i
                    <div className="tooltip">
                      CL - Classic<br />
                      UL - Ultima<br />
                      SL - Super yacht
                    </div>
                  </span>
                </label>
                <select
                  id="teams"
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  required
                >{[{ name: "Select" },
                { name: "CL - Naval Architecture and Hydrodynamics", id: '1142108000000533040' },
                { name: "UL - Naval Architecture and Hydrodynamics", id: '1142108000000533054' },
                { name: "SY - Naval Architecture and Hydrodynamics", id: '1142108000000533068' },
                { name: "CL - Structural Engineering", id: '1142108000000533082' },
                { name: "UL - Structural Engineering", id: '1142108000000533096' },
                { name: "SY - Structural Engineering", id: '1142108000000533110' },
                { name: "CL - Mechanical Propulsion and Systems Engineering", id: '1142108000000533124' },
                { name: "UL - Mechanical Propulsion and Systems Engineering", id: '1142108000000533140' },
                { name: "SY - Mechanical Propulsion and Systems Engineering", id: '1142108000000533154' },
                { name: "CL - Electrical and Electrical Power Systems", id: '1142108000000533168' },
                { name: "UL - Electrical and Electrical Power Systems", id: '1142108000000533182' },
                { name: "SY - Electrical and Electrical Power Systems", id: '1142108000000533202' },
                { name: "CL - Interior Design and Fitout Engineering", id: '1142108000000533216' },
                { name: "UL - Interior Design and Fitout Engineering", id: '1142108000000533230' },
                { name: "SY - Interior Design and Fitout Engineering", id: '1142108000000533244' },
                { name: "CL - Outfitting and Deck Systems", id: '1142108000000533258' },
                { name: "UL - Outfitting and Deck Systems", id: '1142108000000533272' },
                { name: "SY - Outfitting and Deck Systems", id: '1142108000000533286' },
                { name: "CL - 3D CAD/Master Modelling Cell", id: '1142108000000533300' },
                { name: "UL - 3D CAD/Master Modelling Cell", id: '1142108000000533318' },
                { name: "SY - 3D CAD/Master Modelling Cell", id: '1142108000000533332' }]
                  .map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                </select>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priority">Priority </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}

                  >
                    <option value="">Select</option>
                    <option value="Critical - (24 hrs)">Critical - (24 hrs)</option>
                    <option value="High - (48 hrs)">High - (48 hrs)</option>
                    <option value="Medium - (72 hrs)">Medium - (72 hrs)</option>
                    <option value="Low - (96 hrs)">Low - (96 hrs)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="severity">Severity </label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}

                  >
                    <option value="">Select</option>
                    <option value="Show Stopper">Show Stopper</option>
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="projectTitle">Subject  <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"

                />
              </div>

              <div className="form-group">
                <label htmlFor="fileUpload">File Upload</label>
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  onChange={handleInputChange}
                  capture = {false}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <small>Accepted formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG , Max size: 15MB</small>
              </div>
              <button type="submit" className="submit-button">
                {isSubmitting ? (
                  <div className="spinner"></div>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          </div>
          <ToastContainer />
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="app">
        <div className="container">
          <h3 className="front-title">Ticket Mangement</h3>
          <span className="front-subtitle">Engineering And Production</span>
          <p style={{ margin: '40px 0 10px 0' }}>Select Zoho user type:</p>

          <div className="button-container">
            <a
              className="user-button desk-user"
              style={{ textDecoration: 'none' }}
              href="https://www.zoho.com/desk/login.html"
            >
              Zoho Desk User
            </a>
            <button className="user-button other-user" onClick={handleOtherUserClick}>
              Non Zoho User
            </button>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
