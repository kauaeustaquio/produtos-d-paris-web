"use client";

import { Pencil } from 'lucide-react';
import Image from 'next/image';
import "./style.css";

export default function SobreALoja() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;0,700&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

      <div className="top-bar">
        {/* Navegação via a href para a página "telaPrincipal" */}
        <a href="/telaPrincipal" className="home-icon-link">
          <img src="/img/home-botao.png" alt="Início" className="home-icon-img" /> 
        </a>
        <h1 className="top-bar-title">Sobre a Loja</h1>
      </div>

      <div className="container-sobre">
        <div className="card-sobre">
          <div className="logo-container">
            <Image
              src="/logo-produtos-paris.png"
              alt="Produtos D' Paris"
              width={100}
              height={100}
              className="logo-sobre"
            />
            <Pencil size={20} color="#000" className="edit-icon" />
          </div>
          <h1 className="titulo-principal">PRODUTOS D' PARIS</h1>
          <p className="texto-sobre">
            A empresa PRODUTOS D' PARIS foi fundada em 23 de março de 2007. Sendo
            inscrita sob o CNPJ 08.732.255/0001-50. Atualmente está localizada na
            cidade de Esperança, no estado da Paraíba. Sua principal atividade
            econômica é comércio varejista de produtos saneantes domissanitários.
          </p>

          <div className="informacoes">
            <div className="secao">
              <h2 className="subtitulo">Localização <Pencil size={20} color="#000" /></h2>
              <p>Rua Silvino Olavo, Nº 71 - Centro</p>
              <p>Esperança, Paraíba</p>
              <p>CEP 58135-000</p>
            </div>
            <div className="secao">
              <h2 className="subtitulo">Contato <Pencil size={20} color="#000" /></h2>
              <p>(83) 99954-0012</p>
              <p>(83) 98873-5262</p>
              <p>produtosdeparis01@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}