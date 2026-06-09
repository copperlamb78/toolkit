import React, { useState } from "react";
import { COLORS, styles } from "../constants/theme";

export const ProjectDetailScreen = ({ project, onBack, onUpdateProject }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState({ ...project, rawFiles: [] });

  const handleAddMoreImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedProject((prev) => ({
          ...prev,
          images: [...(prev.images || []), event.target.result],
          rawFiles: [...(prev.rawFiles || []), file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setEditedProject((prev) => {
      const isRawFile = index >= (prev.images.length - (prev.rawFiles ? prev.rawFiles.length : 0));
      
      let newImages = [...prev.images];
      let newRawFiles = prev.rawFiles ? [...prev.rawFiles] : [];

      if (isRawFile) {
        const rawIndex = index - (prev.images.length - newRawFiles.length);
        newRawFiles.splice(rawIndex, 1);
      }
      newImages.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        rawFiles: newRawFiles
      };
    });
  };

  const handleSave = async () => {
    try {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt_payload='));
      if (!tokenCookie || !jwtCookie) return;
      
      const token = tokenCookie.split('=')[1];
      const payload = JSON.parse(decodeURIComponent(jwtCookie.split('=')[1]));
      const userId = payload.sub;

      const formData = new FormData();
      formData.append("id", editedProject.id);
      formData.append("name", editedProject.title);
      formData.append("description", editedProject.desc);
      formData.append("category", editedProject.category || "FRONT END");
      formData.append("userId", userId);

      const oldImagesCount = editedProject.images.length - (editedProject.rawFiles ? editedProject.rawFiles.length : 0);
      const oldImagesUrls = editedProject.images.slice(0, oldImagesCount);

      await Promise.all(oldImagesUrls.map(async (url, index) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          const file = new File([blob], `existing_image_${index}.jpg`, { type: blob.type || "image/jpeg" });
          formData.append("photosList", file);
        } catch (error) {
          console.error(`Erro ao converter imagem existente (${url}) para File:`, error);
        }
      }));

      if (editedProject.rawFiles && editedProject.rawFiles.length > 0) {
        editedProject.rawFiles.forEach(file => {
          formData.append("photosList", file);
        });
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${editedProject.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const updatedProj = {
          ...editedProject,
          title: data.name,
          desc: data.description,
          images: data.photosList || editedProject.images,
          category: data.category,
          rawFiles: []
        };
        onUpdateProject(updatedProj);
        setEditedProject(updatedProj);
        setEditMode(false);
      } else {
        console.error("Erro ao atualizar projeto:", await res.text());
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  return (
    <div style={{ ...styles.screen, padding: 0, overflow: "auto" }}>
      {/* Header com botão voltar */}
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        background: COLORS.WHITE, borderBottom: "1px solid #F3F4F6", position: "sticky",
        top: 0, zIndex: 100,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 32, height: 32, borderRadius: "50%", background: "#F3F4F6",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18, color: COLORS.TEXT,
          }}
        >
          ←
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: 0, flex: 1 }}>
          {editedProject.title}
        </h2>
        <button
          onClick={() => editMode ? handleSave() : setEditMode(true)}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: editMode ? `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)` : "#F3F4F6",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16,
            color: editMode ? COLORS.WHITE : COLORS.TEXT,
          }}
          title={editMode ? "Salvar" : "Editar"}
        >
          {editMode ? "✓" : "✏"}
        </button>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Galeria Principal */}
        {editedProject.images && editedProject.images.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div
              onClick={() => !editMode && setFullscreenImage(editedProject.images[0])}
              style={{
                width: "100%", height: 280, borderRadius: 16, overflow: "hidden",
                cursor: !editMode ? "pointer" : "default", marginBottom: 12,
                border: "1px solid #F3F4F6",
              }}
            >
              <img
                src={editedProject.images[0]}
                alt={editedProject.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Grid de imagens adicionais */}
            {editedProject.images.length > 1 && (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8,
              }}>
                {editedProject.images.slice(1).map((img, idx) => (
                  <div
                    key={idx + 1}
                    onClick={() => !editMode && setFullscreenImage(img)}
                    style={{
                      position: "relative", height: 100, borderRadius: 12,
                      overflow: "hidden", cursor: !editMode ? "pointer" : "default",
                      border: "1px solid #F3F4F6",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${editedProject.title} ${idx + 2}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {editMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx + 1);
                        }}
                        style={{
                          position: "absolute", top: -8, right: -8, width: 28, height: 28,
                          borderRadius: "50%", background: "#DC2626", color: "white",
                          border: "none", cursor: "pointer", fontSize: 16, fontWeight: "bold",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Detalhes do Projeto */}
        <div style={{
          background: COLORS.WHITE, borderRadius: 16, padding: 16,
          border: "1px solid #F3F4F6", marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 12px" }}>
            Título
          </h3>
          {editMode ? (
            <input
              type="text"
              value={editedProject.title}
              onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: `1px solid ${COLORS.PURPLE}`, fontSize: 14,
                fontWeight: 600, boxSizing: "border-box",
              }}
            />
          ) : (
            <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.TEXT_MUTED, margin: 0 }}>
              {editedProject.title}
            </p>
          )}
        </div>

        {/* Descrição */}
        <div style={{
          background: COLORS.WHITE, borderRadius: 16, padding: 16,
          border: "1px solid #F3F4F6", marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 12px" }}>
            Descrição
          </h3>
          {editMode ? (
            <textarea
              value={editedProject.desc}
              onChange={(e) => setEditedProject({ ...editedProject, desc: e.target.value })}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                border: `1px solid ${COLORS.PURPLE}`, fontSize: 14,
                minHeight: 100, resize: "none", fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          ) : (
            <p style={{ fontSize: 13, color: COLORS.TEXT_MUTED, margin: 0, lineHeight: 1.6 }}>
              {editedProject.desc}
            </p>
          )}
        </div>

        {/* Adicionar Imagens em Edit Mode */}
        {editMode && (
          <div style={{
            background: COLORS.WHITE, borderRadius: 16, padding: 16,
            border: "1px solid #F3F4F6", marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 12px" }}>
              Imagens
            </h3>
            <div style={{
              padding: 16, borderRadius: 10, border: "2px dashed #E5E7EB",
              background: "#FAFAFA", textAlign: "center", cursor: "pointer", position: "relative",
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddMoreImages}
                style={{ display: "none" }}
                id="projectImageInput"
              />
              <label htmlFor="projectImageInput" style={{ cursor: "pointer", display: "block" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 8px" }}>
                  <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 26c-6.63 0-12-5.37-12-12S9.37 4 16 4s12 5.37 12 12-5.37 12-12 12z" fill={COLORS.PURPLE}/>
                  <path d="M16 8c-1.1 0-2 .9-2 2v4h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4v4c0 1.1.9 2 2 2s2-.9 2-2v-4h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v-4c0-1.1-.9-2-2-2z" fill={COLORS.PURPLE}/>
                </svg>
                <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.PURPLE, margin: "0 0 4px" }}>
                  Clique ou arraste imagens
                </p>
                <p style={{ fontSize: 11, color: COLORS.TEXT_MUTED, margin: 0 }}>PNG, JPG até 10MB</p>
              </label>
            </div>
          </div>
        )}

        {/* Exibir todas as imagens em edit mode */}
        {editMode && editedProject.images && editedProject.images.length > 0 && (
          <div style={{
            background: COLORS.WHITE, borderRadius: 16, padding: 16,
            border: "1px solid #F3F4F6", marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.TEXT, margin: "0 0 12px" }}>
              Imagens ({editedProject.images.length})
            </h3>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8,
            }}>
              {editedProject.images.map((img, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={`Imagem ${idx + 1}`}
                    style={{
                      width: "100%", height: 80, borderRadius: 8, objectFit: "cover",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: "absolute", top: -8, right: -8, width: 24, height: 24,
                      borderRadius: "50%", background: "#DC2626", color: "white",
                      border: "none", cursor: "pointer", fontSize: 12, fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.95)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            style={{
              maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: "absolute", top: 16, right: 16, width: 40, height: 40,
              borderRadius: "50%", background: "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 24,
              color: "white",
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
