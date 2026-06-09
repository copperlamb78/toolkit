import React, { useState, useEffect } from "react";
import { COLORS, styles } from "../constants/theme";

export const ProjectsTab = ({ projects, setProjects, onSelectProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", desc: "", category: "", images: [], rawFiles: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [projectMenu, setProjectMenu] = useState(null);
  const [categories, setCategories] = useState([]);

  const colors = ["#EDE9FE", "#DBEAFE", "#D1FAE5", "#FDE68A", "#FECACA", "#E0E7FF"];

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt_payload='));
        if (!tokenCookie || !jwtCookie) return;

        const token = tokenCookie.split('=')[1];
        const payload = JSON.parse(decodeURIComponent(jwtCookie.split('=')[1]));
        const userId = payload.sub;

        const [res, catRes] = await Promise.all([
          fetch("http://localhost:3250/projects", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("http://localhost:3250/category")
        ]);

        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats);
        }

        if (res.ok) {
          const data = await res.json();
          const userProjects = data.filter(p => p.userId === userId || p.userId?._id === userId);
          
          const mappedProjects = userProjects.map((p, index) => ({
            id: p._id,
            title: p.name,
            desc: p.description,
            images: p.photosList || [],
            color: colors[index % colors.length],
            category: p.category
          }));
          
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.error("Erro ao buscar projetos do usuário:", err);
      }
    };

    fetchUserProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProject((prev) => ({
          ...prev,
          images: [...prev.images, event.target.result],
          rawFiles: [...(prev.rawFiles || []), file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setNewProject((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      rawFiles: (prev.rawFiles || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = async () => {
    if (newProject.title.trim()) {
      try {
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt_payload='));
        if (!tokenCookie || !jwtCookie) return;
        
        const token = tokenCookie.split('=')[1];
        const payload = JSON.parse(decodeURIComponent(jwtCookie.split('=')[1]));
        const userId = payload.sub;

        const formData = new FormData();
        formData.append("name", newProject.title);
        formData.append("description", newProject.desc);
        formData.append("category", newProject.category || (categories.length > 0 ? categories[0].name : "FRONT END"));
        formData.append("userId", userId);

        if (newProject.rawFiles) {
          newProject.rawFiles.forEach(file => {
            formData.append("photosList", file);
          });
        }

        const res = await fetch("http://localhost:3250/projects", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          const newProj = {
            id: data._id,
            title: data.name,
            desc: data.description,
            color: colors[projects.length % colors.length],
            images: data.photosList || [],
            category: data.category
          };
          setProjects([...projects, newProj]);
          setNewProject({ title: "", desc: "", category: "", images: [], rawFiles: [] });
          setShowModal(false);
        } else {
          console.error("Erro ao criar projeto:", await res.text());
        }
      } catch (err) {
        console.error("Erro na requisição:", err);
      }
    }
  };

  const addMoreImages = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);
    setShowGallery(true);
  };

  const handleAddImagesToProject = async (e) => {
    const files = Array.from(e.target.files);
    
    // Para simplificar a integração com o back-end, essa função pode ser complexa
    // porque o endpoint de update atualiza o projeto todo. Vamos apenas atualizar 
    // a preview local para este modal ou redirecionar para a edição.
    // O backend só aceita update completo por PATCH /projects/:id
    
    // Atualização local imediata apenas para visualização
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === selectedProject.id
              ? { ...p, images: [...(p.images || []), event.target.result] }
              : p
          )
        );
        setSelectedProject((prev) => ({
          ...prev,
          images: [...(prev.images || []), event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEditProject = (project) => {
    setEditingProject({ ...project, rawFiles: [] });
    setShowEditModal(true);
    setProjectMenu(null);
  };

  const handleSaveEditProject = async () => {
    try {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt_payload='));
      if (!tokenCookie || !jwtCookie) return;
      
      const token = tokenCookie.split('=')[1];
      const payload = JSON.parse(decodeURIComponent(jwtCookie.split('=')[1]));
      const userId = payload.sub;

      const formData = new FormData();
      formData.append("id", editingProject.id);
      formData.append("name", editingProject.title);
      formData.append("description", editingProject.desc);
      formData.append("category", editingProject.category || (categories.length > 0 ? categories[0].name : "FRONT END"));
      formData.append("userId", userId);

      // Identificar e converter as imagens antigas para File
      const oldImagesCount = editingProject.images.length - (editingProject.rawFiles ? editingProject.rawFiles.length : 0);
      const oldImagesUrls = editingProject.images.slice(0, oldImagesCount);

      // Busca as imagens existentes e as converte para Blobs/Files para simular o upload novamente
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

      // Adiciona as novas imagens enviadas pelo usuário
      if (editingProject.rawFiles && editingProject.rawFiles.length > 0) {
        editingProject.rawFiles.forEach(file => {
          formData.append("photosList", file);
        });
      }

      const res = await fetch(`http://localhost:3250/projects/${editingProject.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const updatedProj = {
          id: data._id,
          title: data.name,
          desc: data.description,
          color: editingProject.color,
          images: data.photosList || editingProject.images, // Usa o que voltou, se não manter o local
          category: data.category
        };
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProj : p));
        setShowEditModal(false);
        setEditingProject(null);
      } else {
        console.error("Erro ao atualizar projeto:", await res.text());
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!tokenCookie) return;
      const token = tokenCookie.split('=')[1];

      const res = await fetch(`http://localhost:3250/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: projectId })
      });

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
        setShowDeleteConfirm(null);
        setProjectMenu(null);
      } else {
        console.error("Erro ao deletar:", await res.text());
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  const handleAddImageToEditingProject = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingProject((prev) => ({
          ...prev,
          images: [...(prev.images || []), event.target.result],
          rawFiles: [...(prev.rawFiles || []), file]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveEditingImage = (index) => {
    setEditingProject((prev) => {
      const isRawFile = index >= (prev.images.length - prev.rawFiles.length);
      
      let newImages = [...prev.images];
      let newRawFiles = [...prev.rawFiles];

      if (isRawFile) {
        const rawIndex = index - (prev.images.length - prev.rawFiles.length);
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

  return (
    <div style={{ ...styles.screen, padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: 0 }}>Meus Projetos</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
            color: COLORS.WHITE, fontSize: 20, fontWeight: 700,
            border: "none", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          +
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectProject && onSelectProject(p)}
            style={{
              background: COLORS.WHITE, borderRadius: 16,
              border: "1px solid #F3F4F6", cursor: "pointer",
              transition: "transform 0.2s", position: "relative"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {p.images && p.images.length > 0 ? (
              <div style={{ height: 160, background: "#F3F4F6", position: "relative", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
                <img
                  src={p.images[0]}
                  alt={p.title}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                  }}
                />
                {p.images.length > 1 && (
                  <div style={{
                    position: "absolute", bottom: 8, right: 8,
                    background: "rgba(0,0,0,0.7)", color: COLORS.WHITE,
                    padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  }}>
                    +{p.images.length - 1}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: 130, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px 16px 0 0" }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="8" width="32" height="24" rx="4" fill="rgba(255,255,255,0.6)"/>
                  <rect x="10" y="16" width="20" height="3" rx="1.5" fill="rgba(0,0,0,0.15)"/>
                  <rect x="10" y="22" width="14" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
                </svg>
              </div>
            )}
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.TEXT, margin: 0 }}>{p.title}</p>
                  <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.PURPLE, background: "#EDE9FE", padding: "2px 6px", borderRadius: 4 }}>
                    {p.category}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: COLORS.TEXT_MUTED, margin: 0 }}>{p.desc}</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 8, position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectMenu(projectMenu === p.id ? null : p.id);
                  }}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#F3F4F6", color: COLORS.TEXT,
                    border: "1px solid #E5E7EB", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 16,
                    flexShrink: 0,
                  }}
                  title="Menu"
                >
                  ⋮
                </button>

                {projectMenu === p.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute", top: 36, right: 0, background: COLORS.WHITE,
                      borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      zIndex: 100, minWidth: 120,
                    }}
                  >
                    <button
                      onClick={() => handleEditProject(p)}
                      style={{
                        display: "block", width: "100%", padding: "10px 12px",
                        background: "none", border: "none", textAlign: "left", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: COLORS.PURPLE,
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      ✏ Editar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(p.id)}
                      style={{
                        display: "block", width: "100%", padding: "10px 12px",
                        background: "none", border: "none", textAlign: "left", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: "#DC2626",
                      }}
                    >
                      🗑 Deletar
                    </button>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addMoreImages(p.id);
                  }}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#F3F4F6", color: COLORS.PURPLE,
                    border: "1px solid #E5E7EB", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 16,
                    flexShrink: 0,
                  }}
                  title="Adicionar imagens"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "flex-end", zIndex: 1000,
        }}>
          <div style={{
            width: "100%", background: COLORS.WHITE, borderRadius: "20px 20px 0 0",
            padding: 24, boxShadow: "0 -4px 16px rgba(0,0,0,0.1)",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 16px" }}>
              Novo Projeto
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Título</label>
              <input
                type="text"
                placeholder="Nome do projeto"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                style={{
                  width: "100%", padding: "12px", marginTop: 8, borderRadius: 10,
                  border: `1px solid #E5E7EB`, fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Categoria</label>
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                style={{
                  width: "100%", padding: "12px", marginTop: 8, borderRadius: 10,
                  border: `1px solid #E5E7EB`, fontSize: 14,
                  boxSizing: "border-box", background: COLORS.WHITE,
                }}
              >
                <option value="">Selecione uma categoria...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Descrição</label>
              <textarea
                placeholder="Descrição do projeto"
                value={newProject.desc}
                onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                style={{
                  width: "100%", padding: "12px", marginTop: 8, borderRadius: 10,
                  border: `1px solid #E5E7EB`, fontSize: 14, resize: "none",
                  minHeight: 80, fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Imagens</label>
              <div style={{
                marginTop: 8, padding: 16, borderRadius: 10, border: "2px dashed #E5E7EB",
                background: "#FAFAFA", textAlign: "center", cursor: "pointer", position: "relative",
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="imageInput"
                />
                <label htmlFor="imageInput" style={{ cursor: "pointer", display: "block" }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 8px" }}>
                    <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 26c-6.63 0-12-5.37-12-12S9.37 4 16 4s12 5.37 12 12-5.37 12-12 12z" fill={COLORS.PURPLE}/>
                    <path d="M16 8c-1.1 0-2 .9-2 2v4h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4v4c0 1.1.9 2 2 2s2-.9 2-2v-4h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v-4c0-1.1-.9-2-2-2z" fill={COLORS.PURPLE}/>
                  </svg>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.PURPLE, margin: "0 0 4px" }}>Clique ou arraste imagens</p>
                  <p style={{ fontSize: 11, color: COLORS.TEXT_MUTED, margin: 0 }}>PNG, JPG até 10MB</p>
                </label>
              </div>

              {newProject.images.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.TEXT_MUTED, margin: "0 0 8px" }}>
                    {newProject.images.length} imagem(ns) adicionada(s)
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 8 }}>
                    {newProject.images.map((img, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          style={{
                            width: "100%", height: 70, borderRadius: 8, objectFit: "cover",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          style={{
                            position: "absolute", top: -8, right: -8, width: 24, height: 24,
                            borderRadius: "50%", background: "#DC2626", color: "white",
                            border: "none", cursor: "pointer", fontSize: 14, fontWeight: "bold",
                            display: "flex", alignItems: "center", justifyContent: "center",
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

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewProject({ title: "", desc: "", category: "", images: [], rawFiles: [] });
                }}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  background: "#F3F4F6", color: COLORS.TEXT,
                  fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProject}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
                  color: COLORS.WHITE, fontSize: 14, fontWeight: 700,
                  border: "none", cursor: "pointer",
                }}
              >
                Criar Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      {showGallery && selectedProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "flex-end", zIndex: 1000,
        }}>
          <div style={{
            width: "100%", background: COLORS.WHITE, borderRadius: "20px 20px 0 0",
            padding: 24, boxShadow: "0 -4px 16px rgba(0,0,0,0.1)",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 16px" }}>
              Adicionar Imagens
            </h3>

            <div style={{
              marginBottom: 20, padding: 16, borderRadius: 10, border: "2px dashed #E5E7EB",
              background: "#FAFAFA", textAlign: "center", cursor: "pointer", position: "relative",
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImagesToProject}
                style={{ display: "none" }}
                id="imageInputGallery"
              />
              <label htmlFor="imageInputGallery" style={{ cursor: "pointer", display: "block" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 8px" }}>
                  <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 26c-6.63 0-12-5.37-12-12S9.37 4 16 4s12 5.37 12 12-5.37 12-12 12z" fill={COLORS.PURPLE}/>
                  <path d="M16 8c-1.1 0-2 .9-2 2v4h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4v4c0 1.1.9 2 2 2s2-.9 2-2v-4h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v-4c0-1.1-.9-2-2-2z" fill={COLORS.PURPLE}/>
                </svg>
                <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.PURPLE, margin: "0 0 4px" }}>Clique ou arraste imagens</p>
                <p style={{ fontSize: 11, color: COLORS.TEXT_MUTED, margin: 0 }}>PNG, JPG até 10MB</p>
              </label>
            </div>

            {selectedProject.images && selectedProject.images.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.TEXT_MUTED, margin: "0 0 8px" }}>
                  Imagens do projeto ({selectedProject.images.length})
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 12, maxHeight: 300, overflowY: "auto", paddingRight: 8 }}>
                  {selectedProject.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={img}
                        alt={`Projeto ${idx + 1}`}
                        style={{
                          width: "100%", height: 80, borderRadius: 8, objectFit: "cover",
                          border: "1px solid #E5E7EB",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowGallery(false);
                setSelectedProject(null);
              }}
              style={{
                width: "100%", padding: "12px", borderRadius: 10,
                background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
                color: COLORS.WHITE, fontSize: 14, fontWeight: 700,
                border: "none", cursor: "pointer",
              }}
            >
              Pronto
            </button>
          </div>
        </div>
      )}

      {showEditModal && editingProject && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "flex-end", zIndex: 1000,
        }}>
          <div style={{
            width: "100%", background: COLORS.WHITE, borderRadius: "20px 20px 0 0",
            padding: 24, boxShadow: "0 -4px 16px rgba(0,0,0,0.1)", maxHeight: "90vh", overflowY: "auto",
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 16px" }}>
              Editar Projeto
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Título</label>
              <input
                type="text"
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                style={{
                  width: "100%", padding: "12px", marginTop: 8, borderRadius: 10,
                  border: `1px solid #E5E7EB`, fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Categoria</label>
              <select
                value={editingProject.category || ""}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                style={{
                  width: "100%", padding: "12px", marginTop: 8, borderRadius: 10,
                  border: `1px solid #E5E7EB`, fontSize: 14,
                  boxSizing: "border-box", background: COLORS.WHITE,
                }}
              >
                <option value="">Selecione uma categoria...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Descrição</label>
              <textarea
                value={editingProject.desc}
                onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                style={{
                  width: "100%", padding: "12px", marginTop: 8, borderRadius: 10,
                  border: `1px solid #E5E7EB`, fontSize: 14, resize: "none",
                  minHeight: 80, fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.TEXT_MUTED }}>Adicionar Imagens</label>
              <div style={{
                marginTop: 8, padding: 16, borderRadius: 10, border: "2px dashed #E5E7EB",
                background: "#FAFAFA", textAlign: "center", cursor: "pointer", position: "relative",
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddImageToEditingProject}
                  style={{ display: "none" }}
                  id="editImageInput"
                />
                <label htmlFor="editImageInput" style={{ cursor: "pointer", display: "block" }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto 8px" }}>
                    <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm0 26c-6.63 0-12-5.37-12-12S9.37 4 16 4s12 5.37 12 12-5.37 12-12 12z" fill={COLORS.PURPLE}/>
                    <path d="M16 8c-1.1 0-2 .9-2 2v4h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4v4c0 1.1.9 2 2 2s2-.9 2-2v-4h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v-4c0-1.1-.9-2-2-2z" fill={COLORS.PURPLE}/>
                  </svg>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.PURPLE, margin: "0 0 4px" }}>Clique ou arraste imagens</p>
                  <p style={{ fontSize: 11, color: COLORS.TEXT_MUTED, margin: 0 }}>PNG, JPG até 10MB</p>
                </label>
              </div>

              {editingProject.images && editingProject.images.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.TEXT_MUTED, margin: "0 0 8px" }}>
                    Imagens ({editingProject.images.length})
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 8 }}>
                    {editingProject.images.map((img, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          style={{
                            width: "100%", height: 70, borderRadius: 8, objectFit: "cover",
                            border: "1px solid #E5E7EB",
                          }}
                        />
                        <button
                          onClick={() => handleRemoveEditingImage(idx)}
                          style={{
                            position: "absolute", top: -8, right: -8, width: 24, height: 24,
                            borderRadius: "50%", background: "#DC2626", color: "white",
                            border: "none", cursor: "pointer", fontSize: 14, fontWeight: "bold",
                            display: "flex", alignItems: "center", justifyContent: "center",
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

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProject(null);
                }}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  background: "#F3F4F6", color: COLORS.TEXT,
                  fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditProject}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${COLORS.PURPLE}, #6D28D9)`,
                  color: COLORS.WHITE, fontSize: 14, fontWeight: 700,
                  border: "none", cursor: "pointer",
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: COLORS.WHITE, borderRadius: 16, padding: 24,
            maxWidth: 300, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.TEXT, margin: "0 0 8px" }}>
              Deletar Projeto?
            </h3>
            <p style={{ fontSize: 13, color: COLORS.TEXT_MUTED, margin: "0 0 20px", lineHeight: 1.5 }}>
              Tem certeza que deseja deletar este projeto? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  background: "#F3F4F6", color: COLORS.TEXT,
                  fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  background: "#DC2626", color: COLORS.WHITE,
                  fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

