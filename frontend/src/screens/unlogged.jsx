import React from "react";
import { COLORS, styles } from "../constants/theme";
import HomeBG  from "../assets/HomeBG.svg";

export const UnloggedProfile = ({ onNavigate }) => (
      <div style={styles.screen}>
          <h1 style={{
            fontSize: 56, fontWeight: 900, color: COLORS.WHITE, margin: 0,
            letterSpacing: -1, lineHeight: 1.1,
            fontFamily: "'Poppins', sans-serif",
          }}>Crie seu portfólio com poucos cliques</h1>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            {["UI/UX", "Dev", "Design", "Motion"].map(tag => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.2)", color: COLORS.WHITE,
                fontSize: 13, fontWeight: 600, padding: "6px 14px",
                borderRadius: 24, backdropFilter: "blur(10px)"
              }}>{tag}</span>
            ))}
          </div>
          <button onClick={() => onNavigate("home")} style={{
            marginTop: 40, padding: "14px 32px",
            background: COLORS.PURPLE, color: COLORS.WHITE,
            fontSize: 16, fontWeight: 700, borderRadius: 12,
            border: "none", cursor: "pointer", letterSpacing: 0.5,
          }}>
            Começar agora →
          </button>
        </div>);
