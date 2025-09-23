import db from "@/lib/db";
import { User, Mail, Lock, Phone, Pencil, ArrowRightFromLine } from 'lucide-react';
import "./style.css";

export default async function ProdutosdParis() {
  const resultado = await db.query("SELECT * FROM usuario");
  const usuario = resultado.rows[0];
  const nomeUsuario = usuario ? usuario.nome : "Usuário";
  const emailUsuario = usuario ? usuario.email : "email@exemplo.com";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

      <div className="top-bar">
        <a href="/telaPrincipal" className="home-botao">
          <img src="/img/home-botao-black.png" alt="Ícone de Home" style={{ width: '40px', height: '40px' }} />
        </a>
      </div>
      
      <div className="black-bar">
        <div className="owner-profile">
          <a href="/telaPropietario" className="owner-icon">
            <img src="/img/propietario-icon.png" alt="Ícone do Proprietário" />
          </a>
        </div>
      </div>

      <div className="container-principal">
        <div className="profile-info">
          <div className="nome-usuario-container">
            <div className="nome-usuario-display">{nomeUsuario}</div>
            <ArrowRightFromLine size={20} color="#000" />
          </div>

          <div className="configuracoes-secao">
            <div className="titulo-secao">Configurações</div>
            <div className="linha-horizontal"></div>
          </div>
          
          <div className="input-field-container">
            <label className="input-label">Nome</label>
            <div className="input-container">
              <input type="text" value={nomeUsuario} readOnly className="input-field" />
              <div className="edit-icon-container"><Pencil size={20} color="#666" /></div>
            </div>
          </div>

          <div className="input-field-container">
            <label className="input-label">Email</label>
            <div className="input-container">
              <input type="text" value={emailUsuario} readOnly className="input-field" />
              <div className="edit-icon-container"><Pencil size={20} color="#666" /></div>
            </div>
          </div>

          <div className="input-field-container">
            <label className="input-label">Senha</label>
            <div className="input-container">
              <input type="password" value="********" readOnly className="input-field" />
              <div className="edit-icon-container"><Pencil size={20} color="#666" /></div>
            </div>
          </div>

          <div className="input-field-container">
            <label className="input-label">Telefone</label>
            <div className="input-container">
              <input type="text" value="(83) 99954-0012" readOnly className="input-field" />
              <div className="edit-icon-container"><Pencil size={20} color="#666" /></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}