import React, { useState, useEffect } from "react";
import { COLORS, styles } from "../constants/theme";

export const ProfileScreen = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("TODOS");
  const [categories, setCategories] = useState(["TODOS"]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt_payload='));
        
        if (!tokenCookie || !jwtCookie) return;

        const token = tokenCookie.split('=')[1];
        const payload = JSON.parse(decodeURIComponent(jwtCookie.split('=')[1]));
        const userId = payload.sub;

        // Buscar Usuários e filtrar o atual
        const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const currentUser = usersData.find(u => u._id === userId || u.id === userId);
          if (currentUser) setUser(currentUser);
        }

        // Buscar Categorias
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/category`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          const catNames = catData.map(c => c.name);
          setCategories(["TODOS", ...catNames]);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt_payload='));
        if (!tokenCookie || !jwtCookie) return;

        const token = tokenCookie.split('=')[1];
        const payload = JSON.parse(decodeURIComponent(jwtCookie.split('=')[1]));
        const userId = payload.sub;

        let url = `${import.meta.env.VITE_API_URL}/projects`;
        if (activeTab !== "TODOS") {
          url = `${import.meta.env.VITE_API_URL}/projects/category/${encodeURIComponent(activeTab)}`;
        }

        const res = await fetch(url, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Filtrar para mostrar apenas os projetos do usuário logado
          const userProjects = data.filter(p => p.userId === userId || p.userId?._id === userId);
          setProjects(userProjects);
        }
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    };

    fetchProjects();
  }, [activeTab]);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "US";

  return (
    <div style={styles.screen}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          {user?.avatar ? (
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `url(${user.avatar}) center/cover`,
              border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 800, color: COLORS.WHITE,
              border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}>{initials}</div>
          )}

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 2px" }}>
              {user?.name || "Carregando..."}
            </h2>
            <p style={{ fontSize: 13, color: COLORS.PURPLE, margin: "0 0 4px", fontWeight: 600 }}>
              {user?.username || ""}
            </p>
            <p style={{ fontSize: 12, color: COLORS.TEXT_MUTED, margin: 0, maxWidth: 200 }}>
              {user?.description || ""}
            </p>
          </div>
          
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 72 }}>
            {user?.linkGithub && (
              <a href={user.linkGithub} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "1.5px solid #E5E7EB", background: COLORS.WHITE,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: COLORS.TEXT,
                }}>GH</div>
              </a>
            )}
            {user?.linkLinkedin && (
              <a href={user.linkLinkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "1.5px solid #E5E7EB", background: COLORS.WHITE,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: COLORS.TEXT,
                }}>in</div>
              </a>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
          {categories.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: activeTab === tab ? COLORS.PURPLE : COLORS.GRAY_LIGHT,
              color: activeTab === tab ? COLORS.WHITE : COLORS.TEXT_MUTED,
              fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {projects.map((p, i) => (
          <div key={p._id || i} style={{
            borderRadius: 16, overflow: "hidden",
            border: "1px solid #F3F4F6", background: COLORS.WHITE,
          }}>
            <div style={{ height: 100, background: COLORS.GRAY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {p.photosList && p.photosList.length > 0 ? (
                <img src={p.photosList[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="4" width="32" height="32" rx="6" fill="rgba(0,0,0,0.1)"/>
                  <rect x="10" y="16" width="20" height="3" rx="1.5" fill="rgba(0,0,0,0.2)"/>
                  <rect x="10" y="22" width="14" height="3" rx="1.5" fill="rgba(0,0,0,0.15)"/>
                </svg>
              )}
            </div>
            <div style={{ padding: "10px 12px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.name}
              </p>
              <p style={{ fontSize: 11, color: COLORS.TEXT_MUTED, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {p.description}
              </p>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: COLORS.TEXT_MUTED, fontSize: 13, marginTop: 24 }}>
            Nenhum projeto encontrado.
          </p>
        )}
      </div>
    </div>
  );
};
