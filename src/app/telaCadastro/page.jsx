"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail } from "lucide-react";

import PhoneInput from "./pageComponents/PhoneInput";
import PasswordInput, {
  validatePasswordComplexity,
} from "./pageComponents/PasswordInput";
import ToastNotification from "./pageComponents/ToastNotification";

import "./style.css";

export default function PaginaCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const router = useRouter();

  const cleanTelefone = (value) => value.replace(/\D/g, "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (senha !== confirmaSenha) {
      setToast("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    const complexityErrors = validatePasswordComplexity(senha);
    if (complexityErrors.length > 0) {
      setToast("A senha não atende aos requisitos de segurança.");
      setIsLoading(false);
      return;
    }

    if (cleanTelefone(telefone).length < 10) {
      setTelefoneError("Telefone inválido. Verifique o DDD.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/autenticacao/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone: cleanTelefone(telefone),
          senha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setToast(errorData.message || "Erro ao cadastrar.");
        setIsLoading(false);
        return;
      }

      setToast("Usuário cadastrado com sucesso!");
      setTimeout(() => router.push("/telaLogin"), 700);
    } catch {
      setToast("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {toast && (
    <ToastNotification
        message={toast}
        duration={7000}
        onClose={() => setToast(null)}
    />
    )}



      <div className="container">
        <div className="login-wrapper">
          {/* LOGO – FORA DO CARD */}
          <div className="logo-side">
            <img
              src="/img/logoCadastroeLogin.svg"
              alt="Logo"
              className="logo-login"
            />
          </div>

          {/* CARD DE CADASTRO */}
          <div className="card cadastro-card">
            <h2 className="titulo">Cadastre-se</h2>
            <div className="divider"></div>

            <form onSubmit={handleSubmit} className="formulario">
              <div className="form-group">
                <label htmlFor="nome" className="label-com-asterisco">
                  Nome *
                </label>
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
                  <span className="input-icon">
                    <User size={25} color="#000" />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="label-com-asterisco">
                  Email *
                </label>
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
                  <span className="input-icon">
                    <Mail size={25} color="#000" />
                  </span>
                </div>
              </div>

              <PhoneInput
                telefone={telefone}
                setTelefone={setTelefone}
                telefoneError={telefoneError}
                setTelefoneError={setTelefoneError}
              />

              <PasswordInput
                label="Senha* (mínimo de 6 caracteres)"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                showPassword={showPassword}
                toggleVisibility={() => setShowPassword(!showPassword)}
              />

              <PasswordInput
                label="Insira a senha novamente*"
                id="confirmaSenha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                showPassword={showPassword}
                toggleVisibility={() => setShowPassword(!showPassword)}
              />

              <div className="button-group">
                <button type="submit" className="button" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </button>
              </div>

              <div className="login-link">
                Já tem uma conta? <a href="/telaLogin">Faça login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
