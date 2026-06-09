import React from "react";
import { COLORS, styles } from "../constants/theme";
import HomeBG from "../assets/HomeBg.svg";

export const HomePage = ({ onNavigate }) => (
  <div style={styles.screen}>
    <div
      style={{
        background: `url(${HomeBG}) no-repeat center center`,
        opacity: 0.9,
        backgroundSize: "cover",
        backgroundPosition: "left",
        position: "relative",
        overflow: "hidden",
        padding: "90px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: COLORS.WHITE,
          margin: 0,
          letterSpacing: -1,
          lineHeight: 1.1,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Crie seu portfólio com poucos cliques
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.9)",
          margin: "20px 0 0",
          maxWidth: 600,
          lineHeight: 1.6,
        }}
      >
        Mostre seus projetos e suas criações profissionais de forma elegante e
        organizada
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {["UI/UX", "Dev", "Design", "Motion"].map((tag) => (
          <span
            key={tag}
            style={{
              background: "rgba(75, 75, 75, 0.2)",
              color: COLORS.WHITE,
              fontSize: 13,
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: 24,
              backdropFilter: "blur(10px)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div style={{ padding: "60px 80px", flex: 1, display: "flex", gap: 60 }}>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {[].map((u) => (
            <div
              key={u.name}
              style={{
                background: COLORS.WHITE,
                borderRadius: 16,
                padding: 24,
                border: "1px solid #F3F4F6",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: u.color,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#374151",
                }}
              >
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.TEXT,
                  margin: "0 0 4px",
                }}
              >
                {u.name}
              </p>
              <p style={{ fontSize: 13, color: COLORS.TEXT_MUTED, margin: 0 }}>
                {u.role}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 90,
          }}
        >
          <button
            onClick={() => onNavigate("login")}
            style={{
              padding: "30px 50px",
              background: COLORS.PURPLE,
              color: COLORS.WHITE,
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            Login
          </button>
          <button
            onClick={() => onNavigate("register")}
            style={{
              padding: "30px 50px",
              background: COLORS.PURPLE,
              color: COLORS.WHITE,
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            Registro
          </button>
        </div>
      </div>
    </div>
  </div>
);
