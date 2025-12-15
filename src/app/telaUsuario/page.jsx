import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Pencil } from "lucide-react";
import LogoutConfirmation from "@/components/LogoutConfirmation";
import "./style.css";

export default async function ProdutosdParis() {
  const session = await getServerSession(authOptions);

  const nomeUsuario = session?.user?.name || "Usuário";
  const emailUsuario = session?.user?.email || "email@exemplo.com";
  const telefonelUsuario = session?.user?.telefone || "(00) 00000-0000";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&family=Poppins:wght@100;400;600;700&display=swap" rel="stylesheet" />

      <div className="top-bar">
        <a href="/telaPrincipal" className="home-botao">
          <img src="/img/home-botao-black.png" alt="Ícone de Home" style={{ width: '40px', height: '40px' }} />
        </a>
      </div>

      <div className="black-bar">
        <div className="owner-profile">
          <a href="/telaUsuario" className="owner-icon">
            <img src="/img/propietario-icon.png" alt="Ícone do Proprietário" />
          </a>
        </div>
      </div>

      <div className="container-principal">
        <div className="profile-info">

          <div className="nome-usuario-container">
            <div className="nome-usuario-display">{nomeUsuario}</div>
            <LogoutConfirmation />
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
            <label className="input-label">Telefone</label>
            <div className="input-container">
              <input type="text" value={telefonelUsuario} readOnly className="input-field" />
              <div className="edit-icon-container"><Pencil size={20} color="#666" /></div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
