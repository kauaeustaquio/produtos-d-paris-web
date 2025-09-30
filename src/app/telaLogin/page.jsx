"use client";

import { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import "./style.css"; // Certifique-se de que o caminho para o CSS está correto

export default function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta do servidor:', errorText);
        alert(`Falha no login: ${errorText || 'Email ou senha incorretos.'}`);
        return; 
      }

      const data = await response.json();
      
      alert(data.message || 'Login realizado com sucesso!');
      
      setEmail('');
      setSenha('');
      
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao tentar fazer login. Verifique sua conexão.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

      <div className="container">
        {/* Espaço para a imagem do logo */}
        <div className="logo-container">
          {/* Coloque sua imagem aqui. Ex: <img src="/img/seu-logo.png" alt="Logo" /> */}
        </div>

        <div className="card login-card">
          <h2 className="titulo">Login</h2>
          
          <form onSubmit={handleSubmit} className="formulario">
            {/* Campo Email */}
            <div className="form-group">
              <label htmlFor="email" className="label-com-asterisco">E-mail *</label>
              <div className="input-icon-container">
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="Insira seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-icon"><Mail size={20} color="#000" /></span>
              </div>
            </div>
            
            {/* Campo Senha */}
            <div className="form-group">
              <label htmlFor="senha" className="label-com-asterisco">Senha*</label>
              <div className="input-icon-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  className="input-field"
                  placeholder="Insira sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <span className="input-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} color="#000" /> : <Eye size={20} color="#000" />}
                </span>
              </div>
            </div>
            
            <div className="button-group">
              <button type="submit" className="button">Entrar</button>
            </div>

            <div className="cadastro-link">
                Não tem uma conta? <a href="/telaCadastro">Cadastre-se</a>
            </div>
            {/* Link para Esqueci a Senha */}
            <div className="forgot-password-link">
              <a href="/esqueci-senha">Esqueci minha senha</a>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}