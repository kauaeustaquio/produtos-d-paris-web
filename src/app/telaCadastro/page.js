"use client";

import { useState } from 'react';
// Importe os ícones de olho aberto e fechado
import { User, Mail, Eye, EyeOff } from 'lucide-react';
import "./style.css";

export default function ProdutosdParis() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  // Adiciona o estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (senha !== confirmaSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const response = await fetch('/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setNome('');
        setEmail('');
        setSenha('');
        setConfirmaSenha('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao tentar cadastrar. Tente novamente.');
    }
  };

  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

      <div className="container">
        <div className="card">
          <h2 className="titulo">Cadastre-se</h2>
          <div className="divider"></div>
          <form onSubmit={handleSubmit} className="formulario">
            <div className="form-group">
              <label htmlFor="nome" className="label-com-asterisco">Nome *</label>
              <div className="input-icon-container">
                <input
                  type="text"
                  id="nome"
                  className="input-field"
                  placeholder="Maria da Silva..."
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <span className="input-icon"><User size={25} color="#000" /></span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email" className="label-com-asterisco">Email *</label>
              <div className="input-icon-container">
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="maria.silva@gmail.com..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-icon"><Mail size={25} color="#000" /></span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="senha" className="label-com-asterisco">Senha* (mínimo de 6 caracteres)</label>
              <div className="input-icon-container">
                <input
                  // Altera o tipo do input com base no estado
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  className="input-field"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                {/* Adiciona o evento onClick no ícone */}
                <span className="input-icon" onClick={togglePasswordVisibility}>
                  {/* Altera o ícone com base no estado */}
                  {showPassword ? <EyeOff size={25} color="#000" /> : <Eye size={25} color="#000" />}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmaSenha" className="label-com-asterisco">Insira a senha novamente*</label>
              <div className="input-icon-container">
                <input
                  // Altera o tipo do input com base no estado
                  type={showPassword ? "text" : "password"}
                  id="confirmaSenha"
                  className="input-field"
                  value={confirmaSenha}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                  required
                />
                {/* Adiciona o evento onClick no ícone */}
                <span className="input-icon" onClick={togglePasswordVisibility}>
                  {/* Altera o ícone com base no estado */}
                  {showPassword ? <EyeOff size={25} color="#000" /> : <Eye size={25} color="#000" />}
                </span>
              </div>
            </div>
            <div className="button-group">
              <button type="submit" className="button">Cadastrar</button>
            </div>
          </form>
          <div className="login-link">
            <span>Já tem uma conta?</span> <a href="/login">Faça login</a>
          </div>
        </div>
      </div>
    </>
  );
}