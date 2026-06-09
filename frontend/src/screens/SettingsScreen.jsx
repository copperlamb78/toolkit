﻿import React, { useState, useEffect, useRef } from "react";
import { COLORS, styles } from "../constants/theme";

export const SettingsScreen = ({ onNavigate }) => {
  const [displayName, setDisplayName] = useState("Luiza Gomes");
  const [profilePhoto, setProfilePhoto] = useState(``);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState("@lvGomes");
  const [bio, setBio] = useState(
    "Descrição sobre o user ou sua profissão, apenas uma descrição e é isso.",
  );

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
        const jwtCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt_payload="));

        if (!tokenCookie || !jwtCookie) return;

        const token = tokenCookie.split("=")[1];
        const payload = JSON.parse(decodeURIComponent(jwtCookie.split("=")[1]));
        const userId = payload.sub;

        const response = await fetch("http://localhost:3250/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar usuários");

        const users = await response.json();
        const currentUser = users.find(
          (u) => u._id === userId || u.id === userId,
        );

        if (currentUser) {
          setDisplayName(currentUser.name || "");
          setUsername(currentUser.username || "");
          setBio(currentUser.description || "");
          setEmail(currentUser.email || "");

          if (currentUser.avatar) {
            setAvatarPreview(currentUser.avatar);
          } else if (currentUser.name) {
            const initials = currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();
            setProfilePhoto(initials);
          }

          setSocials({
            github: currentUser.linkGithub || "",
            linkedin: currentUser.linkLinkedin || "",
            instagram: currentUser.linkInstagram || "",
            twitter: currentUser.linkTwitter || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editMode) {
      setEditMode(true);
      return;
    }

    try {
      setIsLoading(true);
      setSaveMessage("");

      const tokenCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const jwtCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt_payload="));

      if (!tokenCookie || !jwtCookie) {
        throw new Error("Usuário não autenticado");
      }

      const token = tokenCookie.split("=")[1];
      const payload = JSON.parse(decodeURIComponent(jwtCookie.split("=")[1]));
      const userId = payload.sub;

      const formData = new FormData();
      formData.append("name", displayName);
      formData.append("username", username);
      formData.append("description", bio);
      formData.append("email", email);
      if (password !== "••••••••" && password.trim() !== "") {
        formData.append("password", password);
        formData.append("confirmPassword", password);
      }
      formData.append("linkGithub", socials.github);
      formData.append("linkLinkedin", socials.linkedin);
      formData.append("linkInstagram", socials.instagram);
      formData.append("linkTwitter", socials.twitter);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(
        `http://localhost:3250/users/update/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao atualizar o perfil");
      }

      setSaveMessage("✓ Perfil atualizado com sucesso!");
      setTimeout(() => {
        setSaveMessage("");
        setEditMode(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Erro: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialChange = (key, value) => {
    setSocials({ ...socials, [key]: value });
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "jwt_payload=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    onNavigate("home");
  };

  return (
    <div style={styles.screen}>
      <div style={{ padding: "24px" }}>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: COLORS.TEXT,
            margin: "0 0 24px",
          }}
        >
          Configurações
        </h2>

        <form onSubmit={handleSave}>
          {/* Perfil Section */}
          <div
            style={{
              background: COLORS.WHITE,
              borderRadius: 16,
              padding: 20,
              border: "1px solid #F3F4F6",
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.TEXT,
                margin: "0 0 16px",
              }}
            >
              Perfil
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                onClick={handleAvatarClick}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: avatarPreview
                    ? `url(${avatarPreview}) center/cover`
                    : "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  color: COLORS.WHITE,
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  marginBottom: 16,
                  cursor: editMode ? "pointer" : "default",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  editMode && (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  editMode && (e.target.style.transform = "scale(1)")
                }
              >
                {!avatarPreview && profilePhoto}
              </div>
              <p style={{ fontSize: 12, color: COLORS.TEXT_MUTED, margin: 0 }}>
                {editMode ? "Clique na foto para alterar" : ""}
              </p>
            </div>

            {/* Nome e Username */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.TEXT_MUTED,
                  }}
                >
                  Nome
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    marginTop: 4,
                    borderRadius: 10,
                    border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                    fontSize: 14,
                    background: editMode ? COLORS.WHITE : "#F9FAFB",
                    cursor: editMode ? "text" : "default",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.TEXT_MUTED,
                  }}
                >
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    marginTop: 4,
                    borderRadius: 10,
                    border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                    fontSize: 14,
                    background: editMode ? COLORS.WHITE : "#F9FAFB",
                  }}
                />
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.TEXT_MUTED,
                }}
              >
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={!editMode}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 4,
                  borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  fontSize: 14,
                  background: editMode ? COLORS.WHITE : "#F9FAFB",
                  resize: "none",
                  minHeight: 60,
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Redes Sociais */}
          <div
            style={{
              background: COLORS.WHITE,
              borderRadius: 16,
              padding: 20,
              border: "1px solid #F3F4F6",
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.TEXT,
                margin: "0 0 16px",
              }}
            >
              Redes Sociais
            </h3>

            {Object.entries(socials).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.TEXT_MUTED,
                    textTransform: "capitalize",
                  }}
                >
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                  disabled={!editMode}
                  placeholder={`https://${key}.com/...`}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    marginTop: 4,
                    borderRadius: 10,
                    border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                    fontSize: 13,
                    background: editMode ? COLORS.WHITE : "#F9FAFB",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Login Data */}
          <div
            style={{
              background: COLORS.WHITE,
              borderRadius: 16,
              padding: 20,
              border: "1px solid #F3F4F6",
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.TEXT,
                margin: "0 0 16px",
              }}
            >
              Dados de Login
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.TEXT_MUTED,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editMode}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginTop: 4,
                  borderRadius: 10,
                  border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                  fontSize: 14,
                  background: editMode ? COLORS.WHITE : "#F9FAFB",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.TEXT_MUTED,
                }}
              >
                Senha
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!editMode}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                    fontSize: 14,
                    background: editMode ? COLORS.WHITE : "#F9FAFB",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!editMode}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${editMode ? COLORS.PURPLE : "#E5E7EB"}`,
                    background: editMode ? COLORS.WHITE : "#F9FAFB",
                    cursor: editMode ? "pointer" : "default",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              marginBottom: 12,
              background: isLoading
                ? "#9CA3AF"
                : `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
              color: COLORS.WHITE,
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading
              ? "Salvando..."
              : editMode
                ? "Salvar Alterações"
                : "Editar Perfil"}
          </button>

          {saveMessage && (
            <p
              style={{
                fontSize: 13,
                color: saveMessage.startsWith("Erro") ? "#DC2626" : "#10B981",
                margin: "0 0 16px",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {saveMessage}
            </p>
          )}
        </form>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            background: "#FEE2E2",
            color: "#DC2626",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
};
