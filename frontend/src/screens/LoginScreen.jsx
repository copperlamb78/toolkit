import React, { useState } from "react";
import { COLORS, styles } from "../constants/theme";

export const LoginScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    border: "1.5px solid #E5E7EB", borderRadius: 12,
    fontSize: 14, fontFamily: "inherit", outline: "none",
    color: COLORS.TEXT, background: COLORS.WHITE, boxSizing: "border-box",
  };

  const handleLogin = async () => {
    if (!email || !pass) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (!response.ok) {
        throw new Error("E-mail ou senha incorretos.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      onNavigate("profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ ...styles.screen, padding: "24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{
          fontSize: 52, fontWeight: 900, color: COLORS.PURPLE, margin: "0 0 8px",
          letterSpacing: -2, fontFamily: "'Poppins', sans-serif",
        }}>toolkit</h1>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.TEXT, margin: 0 }}>Bem-vindo!</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_MUTED, display: "block", marginBottom: 6 }}>E-mail</label>
          <input style={inputStyle} type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_MUTED, display: "block", marginBottom: 6 }}>Senha</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inputStyle, paddingRight: 44 }} type={showPass ? "text" : "password"} placeholder="Senha" value={pass} onChange={e => setPass(e.target.value)} />
            <button onClick={() => setShowPass(!showPass)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: COLORS.TEXT_MUTED, fontSize: 18,
            }}>{showPass ? "🙈" : "👁"}</button>
          </div>
        </div>
      </div>

      <button onClick={() => onNavigate("home")} style={{
        marginBottom: 4, color: COLORS.PURPLE, background: "none",
        border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600,
        display: "block", textAlign: "right", width: "100%",
      }}>Esqueceu sua senha?</button>

      {error && (
        <p style={{ color: "#DC2626", fontSize: 13, textAlign: "center", margin: "0 0 12px", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <button onClick={handleLogin} disabled={isLoading} style={{
        width: "100%", padding: "14px",
        background: isLoading ? "#9CA3AF" : `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
        color: COLORS.WHITE, fontSize: 15, fontWeight: 700,
        borderRadius: 14, border: "none", cursor: isLoading ? "not-allowed" : "pointer", margin: "12px 0",
      }}>{isLoading ? "Entrando..." : "Login"}</button>

      <p style={{ textAlign: "center", fontSize: 13, color: COLORS.TEXT_MUTED, margin: "8px 0 20px" }}>
        Novo usuário?{" "}
        <button onClick={() => onNavigate("register")} style={{
          color: COLORS.PURPLE, background: "none", border: "none",
          cursor: "pointer", fontWeight: 700, fontSize: 13,
        }}>Cadastre-se</button>
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        <span style={{ fontSize: 12, color: COLORS.TEXT_MUTED }}>ou continue com</span>
        <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {["GitHub", "LinkedIn"].map(s => (
          <button key={s} style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "1.5px solid #E5E7EB", background: COLORS.WHITE,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: COLORS.TEXT,
          }}>{s === "GitHub" ? "GH" : "in"}</button>
        ))}
      </div>
    </div>
  );
};
