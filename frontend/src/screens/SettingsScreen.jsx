import React, { useState } from "react";
import { COLORS, styles } from "../constants/theme";

export const SettingsScreen = ({ onNavigate }) => {
  const [displayName, setDisplayName] = useState("Luiza Gomes");
  const [profilePhoto, setProfilePhoto] = useState("LG");
  const [photoColor, setPhotoColor] = useState("linear-gradient(135deg, #F97316, #EF4444)");
  const [username, setUsername] = useState("@lvGomes");
  const [bio, setBio] = useState("Descrição sobre o user ou sua profissão, apenas uma descrição e é isso.");
  
  const [email, setEmail] = useState("luiza@example.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  
  const [socials, setSocials] = useState({
    github: "https://github.com/lvgomes",
    linkedin: "https://linkedin.com/in/lvgomes",
    instagram: "",
    twitter: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handlePhotoChange = () => {
    const colors = [
      "linear-gradient(135deg, #F97316, #EF4444)",
      "linear-gradient(135deg, #8B5CF6, #6D28D9)",
      "linear-gradient(135deg, #06B6D4, #0891B2)",
      "linear-gradient(135deg, #10B981, #059669)",
      "linear-gradient(135deg, #EC4899, #DB2777)",
    ];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setPhotoColor(newColor);
  };

  const handleSave = () => {
    setSaveMessage("✓ Perfil atualizado com sucesso!");
    setTimeout(() => {
      setSaveMessage("");
      setEditMode(false);
    }, 2000);
  };

  const handleSocialChange = (key, value) => {
    setSocials({ ...socials, [key]: value });
  };

  return (
    <div style={styles.screen}>
      <div style={{ padding: "24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 24px" }}>
          Configurações
        </h2>

        {/* Perfil Section */}
        <div style={{
          background: COLORS.WHITE, borderRadius: 16, padding: 20,
          border: "1px solid #F3F4F6", marginBottom: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 16px" }}>
            Perfil
          </h3>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <div
              onClick={handlePhotoChange}
              style={{
                width: 80, height: 80, borderRadius: "50%",
                background: photoColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, fontWeight: 800, color: COLORS.WHITE,
                border: "3px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                marginBottom: 16, cursor: "pointer", transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              {profilePhoto}
            </div>
            <p style={{ fontSize: 12, color: COLORS.TEXT_MUTED, margin: 0 }}>Clique para mudar cor</p>
          </div>

          {/* Nome e Username */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Nome</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!editMode}
                style={{
                  width: "100%", padding: "10px 12px", marginTop: 4, borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  fontSize: 14, background: editMode ? COLORS.WHITE : "#F9FAFB",
                  cursor: editMode ? "text" : "default",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editMode}
                style={{
                  width: "100%", padding: "10px 12px", marginTop: 4, borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  fontSize: 14, background: editMode ? COLORS.WHITE : "#F9FAFB",
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!editMode}
              style={{
                width: "100%", padding: "10px 12px", marginTop: 4, borderRadius: 10,
                border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                fontSize: 14, background: editMode ? COLORS.WHITE : "#F9FAFB",
                resize: "none", minHeight: 60, fontFamily: "inherit",
              }}
            />
          </div>

          <button
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            style={{
              width: "100%", padding: "12px", borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
              color: COLORS.WHITE, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
            }}
          >
            {editMode ? "Salvar Alterações" : "Editar Perfil"}
          </button>
          {saveMessage && (
            <p style={{ fontSize: 12, color: "#10B981", margin: "12px 0 0", textAlign: "center" }}>
              {saveMessage}
            </p>
          )}
        </div>

        {/* Redes Sociais */}
        <div style={{
          background: COLORS.WHITE, borderRadius: 16, padding: 20,
          border: "1px solid #F3F4F6", marginBottom: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 16px" }}>
            Redes Sociais
          </h3>

          {Object.entries(socials).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED, textTransform: "capitalize" }}>
                {key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleSocialChange(key, e.target.value)}
                disabled={!editMode}
                placeholder={`https://${key}.com/...`}
                style={{
                  width: "100%", padding: "10px 12px", marginTop: 4, borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  fontSize: 13, background: editMode ? COLORS.WHITE : "#F9FAFB",
                }}
              />
            </div>
          ))}
        </div>

        {/* Login Data */}
        <div style={{
          background: COLORS.WHITE, borderRadius: 16, padding: 20,
          border: "1px solid #F3F4F6", marginBottom: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 16px" }}>
            Dados de Login
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editMode}
              style={{
                width: "100%", padding: "10px 12px", marginTop: 4, borderRadius: 10,
                border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                fontSize: 14, background: editMode ? COLORS.WHITE : "#F9FAFB",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Senha</label>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!editMode}
                style={{
                  flex: 1, padding: "10px 12px", borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  fontSize: 14, background: editMode ? COLORS.WHITE : "#F9FAFB",
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                disabled={!editMode}
                style={{
                  padding: "10px 12px", borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  background: editMode ? COLORS.WHITE : "#F9FAFB",
                  cursor: editMode ? "pointer" : "default", fontSize: 12, fontWeight: 600,
                }}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          style={{
            width: "100%", padding: "12px", borderRadius: 10,
            background: "#FEE2E2", color: "#DC2626",
            fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
};
