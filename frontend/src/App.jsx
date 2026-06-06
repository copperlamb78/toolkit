import React, { useState } from "react";
import { styles } from "./constants/theme";

import homeIcon from "./assets/Star Filled.png";
import projectsIcon from "./assets/Create.png";
import profileIcon from "./assets/Profile.png";
import settingsIcon from "./assets/Settings.png";
import toolkitLogo from "./assets/ToolkitLogo.svg";

// Importação das telas organizadas
import { HomePage } from "./screens/HomePage";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ProjectsTab } from "./screens/ProjectsTab";
import { ProjectDetailScreen } from "./screens/ProjectDetailScreen";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [projects, setProjects] = useState([
    { id: 1, title: "Projeto 1", desc: "Descrição do seu projeto. Uma breve descrição sobre o que é o projeto.", color: "#EDE9FE", images: [] },
  ]);
  const [selectedProject, setSelectedProject] = useState(null);

  const navItems = [
    { key: "home", label: "Início", icon: homeIcon  },
    { key: "projects", label: "Projetos", icon: projectsIcon  },
    { key: "profile", label: "Perfil", icon: profileIcon},
    { key: "settings", label: "Configurações", icon: settingsIcon },
  ];

  const handleNav = key => {
    setScreen(key);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setScreen("projectDetail");
  };

  const handleBackFromDetail = () => {
    setSelectedProject(null);
    setScreen("projects");
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomePage onNavigate={handleNav} />;
      case "login": return <LoginScreen onNavigate={handleNav} />;
      case "register": return <RegisterScreen onNavigate={handleNav} />;
      case "profile": return <ProfileScreen onNavigate={handleNav} />;
      case "settings": return <SettingsScreen onNavigate={handleNav} />;
      case "projects": return <ProjectsTab projects={projects} setProjects={setProjects} onSelectProject={handleSelectProject} />;
      case "projectDetail": return selectedProject ? <ProjectDetailScreen project={selectedProject} onBack={handleBackFromDetail} onUpdateProject={handleUpdateProject} /> : <ProjectsTab projects={projects} setProjects={setProjects} onSelectProject={handleSelectProject} />;
      default: return <HomePage onNavigate={handleNav} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { display: none; }
        input:focus { border-color: #7C3AED !important; outline: none; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
      `}</style>
      <div style={styles.app}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarLogo}>
            <img src={toolkitLogo} alt="Toolkit Logo" style={{ width: 150, height: 150 }} />
          </div>
          <div style={styles.sidebarNav}>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                style={{
                  ...styles.navItem,
                  ...(screen === item.key ? styles.navItemActive : {}),
                }}
              >
                <img src={item.icon} alt={item.label} style={{ width: 20, height: 20 }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={styles.phone}>
          {renderScreen()}
        </div>
      </div>
    </>
  );
}
