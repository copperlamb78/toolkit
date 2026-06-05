import React, { useState } from "react";
import { COLORS, styles } from "../constants/theme";
import { FilterStep } from "./FilterStep";

export const RegisterScreen = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    border: "1.5px solid #E5E7EB", borderRadius: 12,
    fontSize: 14, fontFamily: "inherit", outline: "none",
    color: COLORS.TEXT, background: COLORS.WHITE, boxSizing: "border-box",
  };

  if (step === 1) return (
    <div style={{ ...styles.screen, padding: "24px" }}>
      <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 8, color: COLORS.TEXT_MUTED, fontSize: 22 }}>←</button>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 4px" }}>Cadastre-se</h2>
      <p style={{ fontSize: 13, color: COLORS.TEXT_MUTED, margin: "0 0 24px" }}>Crie uma conta para começar</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
        {[1, 2].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: step >= i ? COLORS.PURPLE : "#E5E7EB"
          }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_MUTED, display: "block", marginBottom: 6 }}>Nome</label>
          <input style={inputStyle} placeholder="@id" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_MUTED, display: "block", marginBottom: 6 }}>E-mail</label>
          <input style={inputStyle} type="email" placeholder="nome@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_MUTED, display: "block", marginBottom: 6 }}>Senha</label>
          <input style={inputStyle} type="password" placeholder="Crie sua senha" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.TEXT_MUTED, display: "block", marginBottom: 6 }}>Confirmar senha</label>
          <input style={inputStyle} type="password" placeholder="Crie sua senha" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: COLORS.PURPLE }} />
          <span style={{ fontSize: 13, color: COLORS.TEXT_MUTED }}>
            Li e concordo com os ...
            <span style={{ color: COLORS.PURPLE, fontWeight: 600 }}>termos de privacidade</span>
          </span>
        </label>

        <button onClick={() => setStep(2)} style={{
          width: "100%", padding: "14px",
          background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
          color: COLORS.WHITE, fontSize: 15, fontWeight: 700,
          borderRadius: 14, border: "none", cursor: "pointer", marginTop: 8,
        }}>Próximo</button>
      </div>
    </div>
  );

  return (
    <div style={{ ...styles.screen, padding: "24px" }}>
      <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 8, color: COLORS.TEXT_MUTED, fontSize: 22 }}>←</button>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 4px" }}>Personalize seu perfil</h2>
      <p style={{ fontSize: 13, color: COLORS.TEXT_MUTED, margin: "0 0 24px" }}>Escolha as áreas em que você atua</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
        {[1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= i ? COLORS.PURPLE : "#E5E7EB" }} />
        ))}
      </div>

      <FilterStep onDone={() => onNavigate("profile")} />
    </div>
  );
};
