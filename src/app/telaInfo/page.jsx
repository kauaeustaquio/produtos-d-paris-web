"use client";

import { Pencil, CircleX, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmationModal from "./pageComponents/ConfirmationModal";
import "./style.css";

const initialStoreInfo = {
  company_name: "PRODUTOS D' PARIS",
  aboutText: "",
  location: {
    street: "",
    city_state: "",
    zip: "",
  },
  contact: {
    phone1: "",
    phone2: "",
    email: "",
  },
};

export default function SobreALoja() {
  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  const [editingField, setEditingField] = useState(null);

  const [logoUrl, setLogoUrl] = useState(
    "https://placehold.co/150x150/1c1c1c/FFFFFF?text=P%20D%27%20P"
  );

  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [showLogoConfirmation, setShowLogoConfirmation] = useState(false);
  const [newFile, setNewFile] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingField, setPendingField] = useState(null);
  const [pendingValue, setPendingValue] = useState(null);

  // =========================
  // BUSCAR DADOS DO BANCO
  // =========================
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const res = await fetch("/api/loja/texto");
        if (!res.ok) throw new Error("Erro ao buscar dados");

        const data = await res.json();
        setStoreInfo(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchStoreInfo();
  }, []);

  const handleChangeSection = (section, key, value) => {
    setStoreInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async (field, value) => {
    try {
      const res = await fetch("/api/loja/texto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const askConfirmation = (field, value) => {
    setPendingField(field);
    setPendingValue(value);
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    await handleSave(pendingField, pendingValue);
    setEditingField(null);
    setShowConfirm(false);
    setPendingField(null);
    setPendingValue(null);
  };

  const cancelSave = () => {
    setShowConfirm(false);
    setPendingField(null);
    setPendingValue(null);
    setEditingField(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewFile(file);
    setShowLogoPopup(false);
    setShowLogoConfirmation(true);
  };

  const confirmLogo = () => {
    if (!newFile) return;
    setLogoUrl(URL.createObjectURL(newFile));
    setShowLogoConfirmation(false);
    setNewFile(null);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmationModal
          title="Confirmar alteração"
          message="Deseja salvar essas alterações?"
          onCancel={cancelSave}
          onConfirm={confirmSave}
        />
      )}

      <div className="container-sobre">
        <div className="logo-container">
          <img src={logoUrl} className="logo-sobre" />
          <div
            className="edit-icon-wrapper"
            onClick={() => setShowLogoPopup(true)}
          >
            <Pencil className="edit-icon" />
          </div>
        </div>

        <h2 className="titulo-secao">Sobre a Loja</h2>
        <h1 className="titulo-principal">{storeInfo.company_name}</h1>

        {/* TEXTO SOBRE */}
        <div className="sobre-texto-wrapper">
          {editingField === "aboutText" ? (
            <textarea
              className="editable-textarea"
              value={storeInfo.aboutText}
              autoFocus
              onChange={(e) =>
                setStoreInfo({ ...storeInfo, aboutText: e.target.value })
              }
              onBlur={() =>
                askConfirmation("aboutText", storeInfo.aboutText)
              }
            />
          ) : (
            <>
              <p className="texto-sobre">{storeInfo.aboutText}</p>
              <Pencil
                className="icon-edit-inline"
                onClick={() => setEditingField("aboutText")}
              />
            </>
          )}
        </div>

        {/* LOCALIZAÇÃO E CONTATO */}
        <div className="informacoes">
          {["location", "contact"].map((section) => (
            <div key={section} className="secao">
              <div className="secao-header">
                <h3 className="subtitulo">
                  {section === "location" ? "Localização" : "Contato"}
                </h3>
                <Pencil
                  className="icon-edit"
                  onClick={() => setEditingField(section)}
                />
              </div>

              {Object.keys(storeInfo[section]).map((key) =>
                editingField === section ? (
                  <input
                    key={key}
                    className="editable-input"
                    value={storeInfo[section][key]}
                    onChange={(e) =>
                      handleChangeSection(section, key, e.target.value)
                    }
                    onBlur={() =>
                      askConfirmation(section, storeInfo[section])
                    }
                  />
                ) : (
                  <p key={key}>{storeInfo[section][key]}</p>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
