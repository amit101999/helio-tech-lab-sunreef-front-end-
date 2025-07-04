import { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "./component/Header";
import FileUpload from "./component/FileUpload";

function App() {
  const [ticketNumber, setTicketNum] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  const [projectCode, setProjectCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [ErrorFileSize, setErrorSize] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const [submitButton, setSubmitButton] = useState(true);
  const [projectCodeError, setProjectCodeError] = useState(false);

  // Refs for detecting clicks outside
  const emailContainerRef = useRef(null);
  const projectCodeContainerRef = useRef(null);

  const [formData, setFormData] = useState({
    department: "",
    team: "",
    priority: "",
    severity: "",
    projectTitle: "",
    description: "",
    fileUpload: null,
  });

  const handleOtherUserClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  const form = new FormData();
  form.append("email", email);
  form.append("projectCode", projectCode);
  form.append("department", formData.department);
  form.append("team", formData.team);
  form.append("priority", formData.priority);
  form.append("severity", formData.severity);
  form.append("projectTitle", formData.projectTitle);
  form.append("description", formData.description);
  files && files.forEach((file) => form.append("fileUpload", file));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Email validation
    let emailErrorFlag = false;
    filteredData.forEach((mails) => {
      if (email === mails.email) {
        emailErrorFlag = true;
      }
    });

    // check user entered the correct project code
    const projectErrorFlag = !filteredProjectData.includes(projectCode);

    if (!/sunreef.com/.test(email) || !emailErrorFlag) {
      setErrorEmail(true);
    } else setErrorEmail(false);
    if (projectErrorFlag) {
      setProjectCodeError(true)
      return
    } else setProjectCodeError(false);
    // file size validation
    if (formData.fileUpload && formData.fileUpload.size > 1024 * 1024 * 14) {
      setErrorSize(true);
    } else setErrorSize(false);

    setIsSubmitting(true);
    const res = axios.post(
      import.meta.env.VITE_BURL + "/create-ticket",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const data = await res;
    setIsSubmitting(false);
    if (res) {
      setThankYou(true);
      setShowForm(false);
      const tNum = data.data.ticketNumber;
      if (tNum === null) {
        console.error("WARN no ticketNumber received");
      }
      setTicketNum(tNum)
      ticketNumber === null && toast.success(
        "Ticket created with " +
        `Ticket Number is #${String(tNum).padStart(6, '0') ?? ""}`,
        {
          position: "top-right",
          style: { borderRadius: "5px", color: "black" },
          hideProgressBar: true,
        },
      );
    }

    setEmail("");
    setProjectCode("");
    setFormData({
      department: "",
      team: "",
      priority: "",
      severity: "",
      projectTitle: "",
      description: "",
      fileUpload: null,
    });
    setFiles([]);

  };

  // Email-related state and functions
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [matchedEmails, setMatchedEmails] = useState([]);

  // Project code-related state and functions
  const [allProjectData, setAllProjectData] = useState([]);
  const [filteredProjectData, setFilteredProjectData] = useState([]);
  const [matchedProjectCodes, setMatchedProjectCodes] = useState([]);

  // Fetch data when form loads
  useEffect(() => {
    if (showForm) {
      // Fetch users data
      const fetchUsersData = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_BURL + "/get-users",
          );
          const res = await response.json();
          setAllData(res.data);
        } catch (error) {
          console.error("Failed to fetch users data:", error);
        }
      };

      // Fetch project codes data
      const fetchProjectCodesData = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_BURL + "/get-projectcode",
          );
          const res = await response.json();
          setAllProjectData(res.data);
        } catch (error) {
          console.error("Failed to fetch project codes data:", error);
        }
      };

      fetchUsersData();
      fetchProjectCodesData();
    }
  }, [showForm]);

  // Process users data when it changes
  useEffect(() => {
    if (allData === undefined) return;
    const emails = allData.map((item) => ({
      name: item.name || "",
      email: item.cf?.cf_email || "",
    }));
    setFilteredData(emails);
  }, [allData]);

  // Process project codes data when it changes
  useEffect(() => {
    if (allProjectData && allProjectData.length > 0) {
      const data = allProjectData.map((item) => item.name);
      setFilteredProjectData(data);
    }
  }, [allProjectData]);

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Filter emails as user types
    if (value) {
      const matched = filteredData.filter((mail) =>
        mail.email.toLowerCase().includes(value.toLowerCase())
      );
      setMatchedEmails(matched);
    } else {
      setMatchedEmails(filteredData)
    }
  };

  // Select email from dropdown
  const selectEmail = (selectedMail) => {
    setEmail(selectedMail);
    setMatchedEmails([]);
  };

  // Handle project code input change
  const handleProjectCodeChange = (e) => {
    const value = e.target.value;
    setProjectCode(value);
    // Filter project codes as user types
    if (value) {
      const matched = filteredProjectData.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setMatchedProjectCodes(matched);
    } else {
      setMatchedProjectCodes(filteredProjectData);
    }
  };

  // Select project code from dropdown
  const selectProjectCode = (selectedCode) => {
    setProjectCode(selectedCode);
    setMatchedProjectCodes([]);
  };

  // Handle clicks outside to clear dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Clear email dropdown if clicked outside
      if (
        emailContainerRef.current &&
        !emailContainerRef.current.contains(event.target)
      ) {
        setMatchedEmails([]);
      }

      // Clear project code dropdown if clicked outside
      if (
        projectCodeContainerRef.current &&
        !projectCodeContainerRef.current.contains(event.target)
      ) {
        setMatchedProjectCodes([]);
      }
    };

    // Add event listener when form is shown
    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  return (
    <>
      <Header />
      {/*<div className="wrapper" style={
        {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'grid',
          placeContent: 'center'
        }}>*/}

      <div style={{ transform: showForm ? "translate(-50%,-15%)" : "translate(-50%, -50%)" }} className="app app-home">
        <div className="container">
          {(!thankYou && !showForm) && (
            <>
              <h3 className="front-title">Ticket Management</h3>
              <span className="front-subtitle">Engineering And Production</span>
              <p style={{ margin: "40px 0 10px 0", fontWeight: "bold" }}>
                Select Zoho user type:
              </p>

              <div className="button-container">
                <a
                  className="user-button desk-user"
                  style={{ textDecoration: "none" }}
                  href="https://www.zoho.com/desk/login.html"
                >
                  Zoho Desk User
                </a>
                <button
                  className="user-button other-user"
                  onClick={handleOtherUserClick}
                >
                  Non Zoho User
                </button>
              </div>
              <p style={{ margin: "50px 0 0px 0" }}>
                <button style={{
                  backgroundColor: "#0088D1"
                }} className="user-button">
                  <a
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    href="https://sunreef-users.vercel.app/"
                  >
                    Download the AI powered app
                  </a>
                </button>
              </p>
            </>
          )}
          {thankYou && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 style={{ fontSize: "2rem" }}>Thank You</h1>
              <h2 style={{ marginBottom: "10px" }}>
                Your Ticket has been created.
              </h2>
              <h2 style={{ marginBottom: "30px" }}>
                Ticket Number: {String(ticketNumber).padStart(6, '0')}
              </h2>
              <div className="button-container">
                <button
                  onClick={() => setThankYou(false)}
                  className="user-button"
                >
                  Homepage
                </button>
                <button
                  onClick={() => {
                    window.navigator.clipboard.writeText(String(ticketNumber).padStart(6, '0')).then(
                      () =>
                        toast.success("Ticket ID Copied!", {
                          position: "top-right",
                          style: { borderRadius: "5px", color: "black" },
                          hideProgressBar: true,
                        }),
                    );
                  }}
                  className="user-button"
                >
                  Copy Ticket ID
                </button>
              </div>
            </div>
          )} {showForm && (
            <>
              <h1 style={{ fontSize: "2rem" }}>Create a Ticket</h1>

              <form
                className="user-form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <div className="form-group">
                  <div
                    className="email-autocomplete-container"
                    ref={emailContainerRef}
                  >
                    <label htmlFor="email">
                      Your Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      name="email"
                      onChange={handleEmailChange}
                      placeholder="Enter email"
                      className="email-autocomplete-input"
                    />
                    <span style={{ color: "red" }}>
                      {errorEmail &&
                        "Please enter a valid E-mail."}
                    </span>
                    {matchedEmails.length > 0 && (
                      <div className="email-autocomplete-dropdown">
                        {matchedEmails.map((mail, index) => (
                          <div
                            key={index}
                            onClick={() => selectEmail(mail.email)}
                            className="email-autocomplete-item"
                          >
                            <span className="email-autocomplete-name">
                              {mail.name}
                            </span>
                            <br />
                            <span className="email-autocomplete-email">
                              {mail.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <div
                    className="project-code-autocomplete-container"
                    ref={projectCodeContainerRef}
                  >
                    <label htmlFor="projectCode">
                      Project Number <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={projectCode}
                      name="projectCode"
                      onChange={handleProjectCodeChange}
                      placeholder="Enter project number"
                      className="project-code-autocomplete-input"
                      required
                    />
                    {projectCodeError && <span style={{ color: 'red' }}>Enter a valid project number</span>}

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
                  <label
                    htmlFor="department"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1px",
                    }}
                  >
                    Team <span style={{ color: "red" }}>*</span>
                    {
                      /*<span className="tooltip-button">
                    i
                    <div className="tooltip">
                      CL - Classic<br />
                      UL - Ultima<br />
                      SY - Super Yacht
                    </div>
                  </span>*/
                    }
                  </label>
                  <select
                    id="teams"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    required
                  >
                    {[
                      { name: "Select Team" },
                      { name: "Naval Architecture and Hydrodynamics" },
                      { name: "Structural Engineering" },
                      { name: "Mechanical Propulsion and Systems Engineering" },
                      { name: "Electrical and Electrical Power Systems" },
                      { name: "Interior Design and Fitout Engineering" },
                      { name: "Outfitting and Deck Systems" },
                      { name: "3D CAD/Master Modelling Cell" },
                    ]
                      .map((x, i) => (
                        <option key={i} disabled={!i} value={i ? x.name : ""}>{x.name}</option>
                      ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Critical - (24 hrs)">
                        Critical - (24 hrs)
                      </option>
                      <option value="High - (48 hrs)">High - (48 hrs)</option>
                      <option value="Medium - (72 hrs)">
                        Medium - (72 hrs)
                      </option>
                      <option value="Low - (96 hrs)">Low - (96 hrs)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="severity">Severity</label>
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
                  <label htmlFor="projectTitle">
                    Subject <span style={{ color: "red" }}>*</span>
                  </label>
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
                  <label htmlFor="description">Description</label>
                  <textarea
                    style={{ fontFamily: 'sans' }}
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fileUpload">File Upload</label>
                  {
                    /*<input
                  multiple
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  onChange={handleInputChange}
                  capture={false}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />*/
                  }
                  <FileUpload
                    files={files}
                    setFiles={setFiles}
                    submit={setSubmitButton}
                  />
                  <small>
                    Accepted formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG , Max
                    size: 15MB, Max files: 10
                  </small>
                  <small style={{ color: "red" }}>
                    {ErrorFileSize && "File size should be less than 15MB"}
                  </small>
                </div>
                <button
                  disabled={!submitButton}
                  type="submit"
                  className="submit-button"
                >
                  {isSubmitting ? <div className="spinner"></div> : (
                    "Submit Ticket"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
