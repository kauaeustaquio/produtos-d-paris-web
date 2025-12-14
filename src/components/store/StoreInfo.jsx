"use client";

import { useEffect, useState } from "react";
import LogoEditor from "./LogoEditor";
import ConfirmPopup from "./ConfirmPopup";

<div className="container-sobre">
  <div className="header-info">
    <LogoEditor />
    <h1 className="titulo-principal">
      {storeInfo.company_name}
    </h1>
  </div>

  {/* DESCRIÇÃO */}
  {editingField !== "aboutText" ? (
    <p
      className="texto-sobre"
      onClick={() => setEditingField("aboutText")}
    >
      {storeInfo.aboutText}
    </p>
  ) : (
    <textarea
      className="editable-textarea editing-border"
      autoFocus
      value={storeInfo.aboutText}
      onChange={e =>
        setStoreInfo({ ...storeInfo, aboutText: e.target.value })
      }
      onBlur={() => requestSave("aboutText")}
    />
  )}

  <div className="informacoes">
    {["location", "contact"].map(section => (
      <div key={section} className="secao">
        <h2 className="subtitulo">
          {section === "location" ? "Localização" : "Contato"}
        </h2>

        {Object.entries(storeInfo[section]).map(([key, value]) => (
          <input
            key={key}
            className="editable-input"
            value={value}
            disabled={editingField !== section}
            onChange={e =>
              setStoreInfo({
                ...storeInfo,
                [section]: {
                  ...storeInfo[section],
                  [key]: e.target.value
                }
              })
            }
            onBlur={() =>
              editingField === section && requestSave(section)
            }
          />
        ))}
      </div>
    ))}
  </div>

  {showConfirm && (
    <ConfirmPopup
      onCancel={() => setShowConfirm(false)}
      onConfirm={confirmSave}
    />
  )}
</div>
