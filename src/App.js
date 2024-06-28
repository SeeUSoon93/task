import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import AppHeader from "./components/Header";
import MainContent from "./components/MainContent";
import AddProjectModal from "./components/AddProjectModal";
import { db, collection, addDoc, getDocs, doc, updateDoc } from "./firebase";

// npm install antd firebase moment vis-timeline

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
    useState(false);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    const projectsCollection = collection(db, "projects");
    const snapshot = await getDocs(projectsCollection);
    const projectsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectsData);
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);

    const handleOnline = () => {
      if (sessionStorage.getItem("loggedIn") === "true") {
        setLoggedIn(true);
      }
    };

    const handleOffline = () => {
      setLoggedIn(false);
      sessionStorage.removeItem("loggedIn");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    fetchProjects();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    sessionStorage.setItem("loggedIn", "true");
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsAddProjectModalVisible(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsAddProjectModalVisible(true);
  };

  const handleCancelAddProject = () => {
    setIsAddProjectModalVisible(false);
    setEditingProject(null);
  };

  const handleCreateOrUpdateProject = async (newProject) => {
    const formattedProject = {
      ...newProject,
      period: newProject.period.map((date) =>
        date instanceof Date ? date : date.toDate()
      ),
      requirements: newProject.requirements
        ? newProject.requirements.filter((req) => req.requirement)
        : [],
    };

    if (editingProject) {
      const projectDoc = doc(db, "projects", editingProject.id);
      await updateDoc(projectDoc, formattedProject);
      setProjects(
        projects.map((project) =>
          project.id === editingProject.id
            ? { id: editingProject.id, ...formattedProject }
            : project
        )
      );
    } else {
      const projectDoc = await addDoc(
        collection(db, "projects"),
        formattedProject
      );
      const addedProject = { id: projectDoc.id, ...formattedProject };
      setProjects([...projects, addedProject]);
    }

    setIsAddProjectModalVisible(false);
    setEditingProject(null);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const filteredProjects = projects.filter((project) =>
    project.partner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      {loggedIn ? (
        <>
          <AppHeader
            onAddProject={handleAddProject}
            onSearchChange={handleSearchChange}
          />
          <div className="main-container">
            <MainContent
              projects={filteredProjects}
              onEditProject={handleEditProject}
              setProjects={setProjects}
            />
          </div>
          <AddProjectModal
            open={isAddProjectModalVisible}
            onCancel={handleCancelAddProject}
            onCreate={handleCreateOrUpdateProject}
            initialValues={editingProject}
          />
        </>
      ) : (
        <Login setLoggedIn={handleLogin} />
      )}
    </div>
  );
}

export default App;
