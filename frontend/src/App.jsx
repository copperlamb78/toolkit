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
import { UnloggedProfile } from "./screens/Unlogged";

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
    const isLogged = document.cookie.includes("token=");

    if (!isLogged && !["home", "login", "register"].includes(screen)) {
      return <UnloggedProfile onNavigate={handleNav} />;
    }

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

        /* Responsividade para Mobile */
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-tab-bar { display: flex !important; }
          .phone-container { padding-bottom: calc(76px + env(safe-area-inset-bottom)); }
        }
        @media (min-width: 769px) {
          .mobile-tab-bar { display: none !important; }
        }
      `}</style>
      <div style={styles.app}>
        <div style={styles.sidebar} className="desktop-sidebar">
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
        <div style={styles.phone} className="phone-container">
          {renderScreen()}

          {/* Tab Bar Mobile */}
          <div className="mobile-tab-bar" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            background: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            padding: '8px 16px calc(8px + env(safe-area-inset-bottom)) 16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            zIndex: 50,
          }}>
            {navItems.map(item => {
              const isActive = screen === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: '4px',
                  }}
                >
                  <div style={{
                    padding: '6px 16px', borderRadius: 16,
                    background: isActive ? '#EDE9FE' : 'transparent',
                    transition: 'all 0.2s'
                  }}>
                    <img src={item.icon} alt={item.label} style={{ width: 22, height: 22 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? '#7C3AED' : '#6B7280' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
