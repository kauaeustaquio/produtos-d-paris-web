"use client";

import { Pencil, CircleX, Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import "./style.css";
import { useState } from 'react';

export default function SobreALoja() {
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("/img/logo-loja-info.png");

  const handleEditClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowConfirmation(false);
    setNewImage(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file));
      setShowConfirmation(true);
    }
    setShowPopup(false);
  };

  const handleConfirmation = (confirm) => {
    if (confirm && newImage) {
      setCurrentImage(newImage); // Altera a imagem da logo para a nova imagem
    }
    handleClosePopup();
  };

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button onClick={handleClosePopup} className="close-button">
              <CircleX size={40} color="#FFFFFF" />
            </button>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="upload-box">
              <div className="upload-content">
                <Upload size={50} color="#000000" />
                <p>Carregue a imagem aqui</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="confirmation-content">
              <h3>Confirmar alteração?</h3>
              <div className="button-group">
                <button onClick={() => handleConfirmation(true)} className="confirm-button">Sim</button>
                <button onClick={() => handleConfirmation(false)} className="cancel-button">Não</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="top-bar">
        <Link href="/telaPrincipal" className="home-icon-link">
          <Image
            src="/img/home-botao.png"
            alt="Início"
            width={40}
            height={40}
            className="home-icon-img"
          />
        </Link>
      </div>

      <div className="container-sobre">
        <div className="header-info">
          <h2 className="titulo-secao">Sobre a Loja</h2>
          <div className="logo-container">
            <Image
              src={currentImage} // O src agora é dinâmico, baseado no estado
              alt="Produtos D' Paris"
              width={150}
              height={150}
              className="logo-sobre"
            />
            <div onClick={handleEditClick} className="edit-icon-wrapper">
               <Image
                 src="/img/editar-botao.png"
                 alt="Ícone de Editar"
                 width={40}
                 height={40}
                 className="edit-icon"
               />
            </div>
          </div>
          <h1 className="titulo-principal">PRODUTOS D' PARIS</h1>
        </div>

        <p className="texto-sobre">
          A empresa PRODUTOS D' PARIS foi fundada em 23 de março de 2007. <span onClick={handleEditClick} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>Sendo <Pencil size={20} color="#000" style={{ marginLeft: '5px' }}/></span>
          inscrita sob o CNPJ 08.732.255/0001-50. Atualmente está localizada na
          cidade de Esperança, no estado da Paraíba. Sua principal atividade
          econômica é comércio varejista de produtos saneantes domissanitários.
        </p>

        <div className="informacoes">
          <div className="secao">
            <h2 className="subtitulo">
              Localização <Pencil size={20} color="#000" style={{ marginLeft: '8px' }} onClick={handleEditClick}/>
            </h2>
            <p>Rua Silvino Olavo, Nº 71 - Centro</p>
            <p>Esperança, Paraíba</p>
            <p>CEP 58135-000</p>
          </div>
          <div className="secao">
            <h2 className="subtitulo">
              Contato <Pencil size={20} color="#000" style={{ marginLeft: '8px' }} onClick={handleEditClick}/>
            </h2>
            <p>(83) 99954-0012</p>
            <p>(83) 98873-5262</p>
            <p>produtosdeparis01@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
}