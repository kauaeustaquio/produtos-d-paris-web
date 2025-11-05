"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail } from 'lucide-react'; 
// 🟢 Caminho relativo corrigido para os componentes
import PhoneInput from './pageComponents/PhoneInput'; 
import PasswordInput, { validatePasswordComplexity } from './pageComponents/PasswordInput'; 
import "./style.css";

export default function PaginaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState(''); 
  const [telefoneError, setTelefoneError] = useState(''); 
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  // Função auxiliar para limpar o telefone antes do envio
  const cleanTelefone = (value) => value.replace(/\D/g, '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // 1. Validação de Senhas Coincidentes
    if (senha !== confirmaSenha) {
      alert('As senhas não coincidem!');
      setIsLoading(false);
      return;
    }
    
    // 2. 🟢 Validação de Complexidade da Senha
    const complexityErrors = validatePasswordComplexity(senha);
    if (complexityErrors.length > 0) {
        // Exibe o alerta genérico e confia no PasswordInput para mostrar os detalhes
        alert('A senha não atende aos requisitos de complexidade. Por favor, verifique as regras.');
        setIsLoading(false);
        return;
    }

    // 3. Validação final do Telefone
    if (cleanTelefone(telefone).length < 10) {
        setTelefoneError('Telefone inválido. Verifique o DDD.');
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/autenticacao/signup', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nome, 
            email, 
            telefone: cleanTelefone(telefone), 
            senha 
        }), 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || `Erro ${response.status}: Falha ao cadastrar.`;
        alert(`Erro: ${errorMessage}`);
        return; 
      }

      alert('Usuário cadastrado com sucesso!');
      setNome(''); setEmail(''); setTelefone(''); setSenha(''); setConfirmaSenha('');
      router.push('/telaLogin');

    } catch (error) {
      alert('Erro de conexão. Tente novamente.');
    } finally {
        setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="container">
        <div className="card">
          <h2 className="titulo">Cadastre-se</h2>
          <div className="divider"></div>
          <form onSubmit={handleSubmit} className="formulario">
            
            {/* Campo Nome */}
            <div className="form-group">
              <label htmlFor="nome" className="label-com-asterisco">Nome *</label>
              <div className="input-icon-container">
                <input
                  type="text" id="nome" className="input-field" placeholder="Maria da Silva..."
                  value={nome} onChange={(e) => setNome(e.target.value)} required
                />
                <span className="input-icon"><User size={25} color="#000" /></span>
              </div>
            </div>
            
            {/* Campo Email */}
            <div className="form-group">
              <label htmlFor="email" className="label-com-asterisco">Email *</label>
              <div className="input-icon-container">
                <input
                  type="email" id="email" className="input-field" placeholder="maria.silva@gmail.com..."
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
                <span className="input-icon"><Mail size={25} color="#000" /></span>
              </div>
            </div>
            
            {/* Componente PhoneInput */}
            <PhoneInput 
                telefone={telefone} 
                setTelefone={setTelefone} 
                telefoneError={telefoneError} 
                setTelefoneError={setTelefoneError}
            />
            
            {/* Componente PasswordInput (Senha) */}
            <PasswordInput
                label="Senha* (mínimo de 6 caracteres)"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                showPassword={showPassword}
                toggleVisibility={togglePasswordVisibility}
            />
            
            {/* Componente PasswordInput (Confirma Senha) */}
            <PasswordInput
                label="Insira a senha novamente*"
                id="confirmaSenha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                showPassword={showPassword}
                toggleVisibility={togglePasswordVisibility}
            />
            
            {/* Botão Cadastrar */}
            <div className="button-group">
              <button type="submit" className="button" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
            
            <div className="login-link">
                <span>Já tem uma conta?</span> <a href="/telaLogin">Faça login</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}