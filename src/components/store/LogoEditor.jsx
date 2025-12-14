"use client";

import { useState } from "react";

export default function LogoEditor() {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Envie apenas imagens");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Imagem muito grande (máx 2MB)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const res = await fetch("/api/loja/logo", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    const data = await res.json();
    setLogo(data.url);
  };

  return (
    <div className="logo-container">
      <img
        src={logo || "/logo-placeholder.png"}
        className="logo-sobre"
        alt="Logo da loja"
      />

      <label className="edit-icon-wrapper">
        ✎
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleUpload}
        />
      </label>

      {loading && <p>Enviando...</p>}
    </div>
  );
}
