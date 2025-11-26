"use client";

import { Pencil, CircleX, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';

// Estado inicial padrão (dados baseados na imagem fornecida)
const initialStoreInfo = { 
  company_name: "PRODUTOS D' PARIS", 
  aboutText: "A empresa PRODUTOS D' PARIS foi fundada em 23 de março de 2007. Sendo inscrita sob o CNPJ 08.732.255/0001-50. Atualmente está localizada na cidade de Esperança, no estado de Paraíba. Sua principal atividade econômica é comércio varejista de produtos saneantes domissanitários.", 
  location: { 
    street: "Rua Silvino Olavo, Nº 71 - Centro", 
    city_state: "Esperança, Paraíba", 
    zip: "CEP 58135-000" 
  }, 
  contact: { 
    phone1: "(83) 99954-0012", 
    phone2: "(83) 98873-5262", 
    email: "produtosdeparis01@gmail.com" 
  } 
};

// Componente Principal
export default function SobreALoja() {
  const [logoUrl, setLogoUrl] = useState("https://placehold.co/150x150/1c1c1c/FFFFFF?text=P%20D%27%20P"); // Usando placeholder para evitar erro de imagem local
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [showLogoConfirmation, setShowLogoConfirmation] = useState(false);
  const [newFile, setNewFile] = useState(null);

  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  // Estado para rastrear qual campo está sendo editado
  const [editingField, setEditingField] = useState(null);

  // Handler para campos que são objetos (location, contact)
  const handleChangeSection = (section, key, value) => {
    setStoreInfo(prevInfo => ({
      ...prevInfo,
      [section]: {
        ...prevInfo[section],
        [key]: value
      }
    }));
  };

  // Lógica de Salvamento ao sair do campo (onBlur) - Simulação de API Call
  const handleSave = async (field, currentValue) => {
    // Verifica se a função foi disparada corretamente
    if (!editingField || editingField !== field) return;
    
    // Finaliza o modo de edição
    setEditingField(null);

    // Simulação de payload
    const valueToSave = field === 'aboutText' ? currentValue : storeInfo[field];

    try {
        
        fetch('/api/loja/texto', { method: 'POST', body: JSON.stringify(payload) })

        // Simulação de sucesso
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`O campo ${field} foi alterado com sucesso (SIMULAÇÃO)!`);

    } catch (error) {
        console.error('Erro ao salvar o texto (SIMULAÇÃO):', error);
    }
  };


  // --- FUNÇÕES DA LOGO ---
  const handleLogoClick = () => {
    setShowLogoPopup(true);
  };

  const handleClosePopup = () => {
    setShowLogoPopup(false);
    setShowLogoConfirmation(false);
    setNewFile(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewFile(file);
      setShowLogoConfirmation(true);
      setShowLogoPopup(false);
    }
  };

  const handleLogoConfirmation = async (confirm) => {
    if (confirm && newFile) {
      // Simulação de envio de imagem
      try {
        console.log('Simulando upload da nova logo...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Cria um URL temporário para pré-visualização no navegador
        const tempUrl = URL.createObjectURL(newFile); 
        setLogoUrl(tempUrl);
        console.log("Logo alterada com sucesso (SIMULAÇÃO)!");

      } catch (error) {
        console.error('Erro ao enviar a imagem (SIMULAÇÃO):', error);
      }
    }
    handleClosePopup();
  };

  // Ícones do Lucide para as seções, mantendo a estrutura original
  const getIcon = (fieldKey, key) => {
    // A cor dos ícones foi mantida como text-red-600 para dar destaque, mas pode ser ajustada para cinza se necessário.
    const iconColor = "text-black-000"; 
    
    if (fieldKey === 'location') {
      if (key === 'street') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-map-pin mr-2 ${iconColor}`}><path d="M12 18V18"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>;
      if (key === 'city_state') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-home mr-2 ${iconColor}`}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
      if (key === 'zip') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-send mr-2 ${iconColor}`}><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M15 15l4-4"/></svg>;
    }
    if (fieldKey === 'contact') {
      if (key === 'phone1' || key === 'phone2') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-phone mr-2 ${iconColor}`}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.62-4.62A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
      if (key === 'email') return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-mail mr-2 ${iconColor}`}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.2 6.8-1.8 1.5-1.8-1.5L2 7"/></svg>;
    }
    return null;
  };


  // --- RENDERIZAÇÃO PRINCIPAL (JSX Otimizado) ---
  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Definindo um estilo de corpo básico para a fonte Inter e fundo claro */}
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8f4f0; /* Fundo geral */
          color: #333333; /* Cor do texto padrão */
        }
      `}</style>

      {/* POP-UPS */}
      {(showLogoPopup || showLogoConfirmation) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl relative max-w-sm w-full text-center">
            <button onClick={handleClosePopup} className="absolute top-3 right-3 bg-transparent border-none cursor-pointer p-1">
              <CircleX size={30} className="text-gray-500 hover:text-gray-800 transition" />
            </button>

            {showLogoPopup && (
              <>
                <h3 className="text-2xl font-semibold mb-6 text-gray-700">Carregar Nova Logo</h3>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  accept="image/*"
                />
                <label htmlFor="file-upload" className="block border-2 border-dashed border-black-000 rounded-xl p-10 cursor-pointer transition-colors hover:bg-red-50">
                  <div className="flex flex-col items-center text-gray-700">
                    <Upload size={50} className="text-black-000 mb-3" />
                    <p className="font-medium">Clique para selecionar uma imagem</p>
                    <p className="text-sm text-gray-500 mt-1">Formatos: JPG, PNG, GIF</p>
                  </div>
                </label>
              </>
            )}

            {showLogoConfirmation && (
              <div className="confirmation-content">
                <h3 className="text-2xl font-bold text-red-700 mb-6">Confirmar alteração da Logo?</h3>
                <p className="mb-8 text-gray-600">O arquivo selecionado será a nova imagem da sua loja.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => handleLogoConfirmation(true)} className="px-6 py-2 bg-red-700 text-white font-bold rounded-lg transition-all hover:bg-red-800 hover:scale-[1.02] shadow-md">
                    Sim, Atualizar
                  </button>
                  <button onClick={() => handleLogoConfirmation(false)} className="px-6 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg transition-all hover:bg-gray-400 hover:scale-[1.02] shadow-md">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL DA TELA */}
      <div className="flex justify-end max-w-4xl mx-auto pt-4 px-6 md:px-0">
        <a href="/telaPrincipal" className="inline-block transition-transform duration-200 cursor-pointer rounded-full shadow-md overflow-hidden hover:scale-105">
          {/* Ícone Home em SVG */}
          <svg className="w-10 h-10 bg-white p-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#1c1c1c" strokeWidth="2">
            <path d="M3 10V21H21V10L12 3L3 10Z" fill="#F0F0F0" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V12H15V21" fill="#FFFFFF" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-xl transition-all">
        <div className="text-center pb-5 border-b border-gray-200 mb-5">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Sobre a Loja</h2>
          
          {/* LOGO E BOTÃO DE EDIÇÃO */}
          <div className="relative inline-block mb-4">
            <img
              src={logoUrl}
              alt="Produtos D' Paris"
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-900 shadow-xl transition-colors duration-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/1c1c1c/FFFFFF?text=P%20D%27%20P" }}
            />
            <div onClick={handleLogoClick} className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-lg transition-transform duration-200 hover:scale-110 ring-2 ring-gray-200">
              <Pencil size={18} className="text-red-700" /> {/* Usando o ícone Pencil para editar a logo */}
            </div>
          </div>
          <h1 className="text-4xl text-gray-800 mt-2 font-extrabold">{storeInfo.company_name}</h1>
        </div>

        {/* CAMPO DE DESCRIÇÃO EDITÁVEL (ABOUT TEXT) */}
        {editingField !== 'aboutText' ? (
          <p 
            className="text-base leading-relaxed text-justify mb-8 p-3 text-gray-700 rounded-lg cursor-pointer transition-colors hover:bg-gray-100" 
            onClick={() => setEditingField('aboutText')}
          >
            {storeInfo.aboutText}{" "}
            <Pencil size={16} className="text-red-700 inline ml-1" />
          </p>
        ) : (
          <div className="mb-8 p-3">
            <textarea
              value={storeInfo.aboutText}
              onChange={(e) => setStoreInfo(prev => ({ ...prev, aboutText: e.target.value }))}
              onBlur={(e) => handleSave('aboutText', e.target.value)}
              autoFocus
              rows={5}
              // ALTERADO: Contorno preto fino (1px) e sólido no lugar do pontilhado/cinza.
              className="bg-white border border-gray-900 rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-base text-gray-700 transition duration-300"
              style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
            />
          </div>
        )}

        {/* SEÇÕES DE INFORMAÇÃO EDITÁVEIS (LOCALIZAÇÃO E CONTATO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['location', 'contact'].map(fieldKey => {
            const title = fieldKey === 'location' ? 'Localização' : 'Contato';
            const data = storeInfo[fieldKey];
            const isEditing = editingField === fieldKey;
            const dataKeys = Object.keys(data);

            return (
              <div 
                key={fieldKey}
                // ALTERADO: Contorno do box de edição agora é preto sólido (border-gray-900) e sem ring.
                className={`p-6 rounded-xl transition-shadow border-2 border-gray-100 ${isEditing ? 'border-2 border-gray-900 shadow-lg' : 'bg-gray-50 shadow-md hover:shadow-xl'}`}
                // Salva a seção quando o foco sai de qualquer input interno
                onBlur={(e) => isEditing && !e.currentTarget.contains(e.relatedTarget) && handleSave(fieldKey, storeInfo[fieldKey])}
              >
                <h2 
                  className="text-2xl text-gray-800 font-semibold mb-4 pb-2 border-b-2 border-gray-300 flex items-center cursor-pointer" 
                  onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }}
                >
                  {title} 
                  <Pencil size={20} className="text-red-700 ml-2" />
                </h2>
                {dataKeys.map((key, index) => (
                  <div key={key} className="flex items-center text-gray-700 mb-3">
                    {getIcon(fieldKey, key)}
                    
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={data[key]}
                            onChange={(e) => handleChangeSection(fieldKey, key, e.target.value)}
                            autoFocus={index === 0}
                            // ALTERADO: Garante que os inputs de edição sejam brancos e muda o foco de vermelho para preto.
                            className="bg-white flex-grow p-1.5 border-b-2 border-gray-400 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition duration-150 text-base"
                            style={{ fontFamily: 'inherit' }}
                        />
                    ) : (
                        <span className="text-base font-medium">{data[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}