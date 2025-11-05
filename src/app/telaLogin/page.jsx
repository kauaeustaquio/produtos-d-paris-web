"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 🟢 CORREÇÃO: Importar 'signIn' e 'useSession' de 'next-auth/react'
import { signIn } from 'next-auth/react'; 
import { Mail, Eye, EyeOff } from 'lucide-react';
import "./style.css"; // Manter o caminho para o CSS

export default function PaginaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); // Adicionar estado de loading
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
        // 🟢 CORREÇÃO: Usar a função 'signIn' do NextAuth para credenciais
        const resultado = await signIn('credentials', { 
            // Os nomes dos campos devem ser os mesmos definidos no CredentialsProvider:
            email,
            senha,
            // Desativar o redirecionamento automático para tratar a resposta manualmente:
            redirect: false,
        });

        if (resultado.error) {
            // Se houver erro (retorno null no authorize), o NextAuth define 'error'
            console.error('Falha no login:', resultado.error);
            alert('Falha no login: Credenciais inválidas. Tente novamente.');
            
        } else if (resultado.ok) {
            // Login bem-sucedido
            alert('Login realizado com sucesso! Redirecionando...');
            // Redirecionar para a página principal ou home
            router.push('/'); 
        }
      
        setEmail('');
        setSenha('');
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao tentar fazer login. Verifique sua conexão.');
    } finally {
        setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />

      <div className="container">

        <div className="logo-container">
          {/* Logo */}
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
              <button type="submit" className="button" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
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