import React, { useState } from "react";
import { COLORS } from "../constants/theme";

export const FilterStep = ({ onDone }) => {
  const areas = [
    "User Interface", "User Experience", "User Research",
    "UX Writing", "User Testing", "Service Design",
    "Strategy", "Design Systems",
  ];
  const [selected, setSelected] = useState(["User Interface", "User Research", "Strategy", "Design Systems"]);

  const toggle = area => setSelected(prev =>
    prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
  );

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {areas.map(area => {
          const on = selected.includes(area);
          return (
            <button key={area} onClick={() => toggle(area)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", borderRadius: 12,
              border: `1.5px solid ${on ? COLORS.PURPLE : "#E5E7EB"}`,
              background: on ? COLORS.PURPLE_LIGHT : COLORS.WHITE,
              cursor: "pointer", width: "100%",
            }}>
              <span style={{ fontSize: 14, fontWeight: on ? 700 : 400, color: on ? COLORS.PURPLE : COLORS.TEXT }}>{area}</span>
              {on && (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9L7.5 12.5L14 6" stroke={COLORS.PURPLE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      <button onClick={onDone} style={{
        width: "100%", padding: "14px", marginTop: 20,
        background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
        color: COLORS.WHITE, fontSize: 15, fontWeight: 700,
        borderRadius: 14, border: "none", cursor: "pointer",
      }}>Próximo →</button>
    </div>
  );
};
