import React, { useState } from "react";
import { COLORS, styles } from "../constants/theme";

export const ProfileScreen = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("FRONT END");
  const tabs = ["FRONT END", "BACK END", "DADOS", "TODOS"];
  const projects = [
    { title: "Projeto 1", desc: "Descrição do seu projeto.", color: "#BFDBFE" },
    { title: "Projeto 1", desc: "Descrição do seu projeto.", color: "#DDD6FE" },
    { title: "Projeto 1", desc: "Descrição do seu projeto.", color: "#FDE68A" },
    { title: "Projeto 1", desc: "Descrição do seu projeto.", color: "#BBF7D0" },
  ];

  return (
    <div style={styles.screen}>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #F97316, #EF4444)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, color: COLORS.WHITE,
            border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}>LG</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 2px" }}>Luiza Gomes</h2>
            <p style={{ fontSize: 13, color: COLORS.PURPLE, margin: "0 0 4px", fontWeight: 600 }}>@lvGomes</p>
            <p style={{ fontSize: 12, color: COLORS.TEXT_MUTED, margin: 0, maxWidth: 200 }}>Descrição sobre o user ou sua profissão, apenas uma descrição e é isso.</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["GH", "in"].map(s => (
              <div key={s} style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "1.5px solid #E5E7EB", background: COLORS.WHITE,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: COLORS.TEXT,
              }}>{s}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto" }}>
          {tabs.map(tab => (
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
          <div key={i} style={{
            borderRadius: 16, overflow: "hidden",
            border: "1px solid #F3F4F6", background: COLORS.WHITE,
          }}>
            <div style={{ height: 100, background: p.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="4" width="32" height="32" rx="6" fill="rgba(255,255,255,0.5)"/>
                <rect x="10" y="16" width="20" height="3" rx="1.5" fill="rgba(0,0,0,0.2)"/>
                <rect x="10" y="22" width="14" height="3" rx="1.5" fill="rgba(0,0,0,0.15)"/>
              </svg>
            </div>
            <div style={{ padding: "10px 12px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 4px" }}>{p.title}</p>
              <p style={{ fontSize: 11, color: COLORS.TEXT_MUTED, margin: 0 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
