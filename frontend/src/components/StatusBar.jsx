import React from "react";
import { styles } from "../constants/theme";

export const StatusBar = () => (
  <div style={styles.statusBar}>
    <span>9:41</span>
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <rect x="0" y="6" width="3" height="6" rx="1" fill="#111827" />
        <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111827" />
        <rect x="9" y="2" width="3" height="10" rx="1" fill="#111827" />
        <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#111827" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 20 14" fill="none">
        <path d="M10 2.5C13.5 2.5 16.5 4 18.5 6.5L20 5C17.5 2 14 0.5 10 0.5C6 0.5 2.5 2 0 5L1.5 6.5C3.5 4 6.5 2.5 10 2.5Z" fill="#111827"/>
        <path d="M10 6C12.5 6 14.5 7 16 8.5L17.5 7C15.5 5 13 4 10 4C7 4 4.5 5 2.5 7L4 8.5C5.5 7 7.5 6 10 6Z" fill="#111827"/>
        <circle cx="10" cy="12" r="2" fill="#111827"/>
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="#111827" strokeOpacity="0.35"/>
        <rect x="2" y="2" width="17" height="8" rx="2" fill="#111827"/>
        <path d="M23.5 4V8C24.3 7.5 25 6.5 25 6C25 5.5 24.3 4.5 23.5 4Z" fill="#111827" fillOpacity="0.4"/>
      </svg>
    </div>
  </div>
);
