"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Eye, EyeOff } from "lucide-react";
import AlertMessage from "./pageComponents/AlertMessage";
import "./style.css";

export default function PaginaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/telaPrincipal";

  // LOGIN COM CREDENCIAIS
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const resultado = await signIn("credentials", {
        email,
        senha,
        redirect: false,
        callbackUrl,
      });

      if (resultado?.error) {
        setToast({
          type: "error",
          message:
            "Não foi possível realizar o login, pois o usuário não possui cadastro.",
        });
      } else if (resultado?.ok) {
        setToast({ type: "success", message: "Login realizado com sucesso!" });
        setTimeout(() => router.push(callbackUrl), 800);
      }

      setEmail("");
      setSenha("");
    } catch (error) {
      setToast({
        type: "error",
        message: "Erro ao tentar fazer login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN GOOGLE — REDIRECT TRUE
const handleGoogleLogin = async () => {
  setIsLoading(true);

  try {
    await signIn("google", {
      callbackUrl: `${window.location.origin}/telaPrincipal`,
    });
  } catch (error) {
    setToast({
      type: "error",
      message: "Erro ao tentar fazer login com Google.",
    });
  } finally {
    setIsLoading(false);
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Fonte */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sansation:wght@300;400;700&family=Urbanist:wght@100..900&display=swap"
        rel="stylesheet"
      />

      {/* ALERT GLOBAL */}
      {toast && (
        <AlertMessage
          type={toast.type}
          message={toast.message}
          duration={10000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container">
        <div className="card login-card">
          <h2 className="titulo">Login</h2>

          {/* GOOGLE */}
          <button className="button google-btn" onClick={handleGoogleLogin}>
            Continuar com Google
          </button>

          <div className="divisor">ou</div>

          <form onSubmit={handleSubmit} className="formulario">
            <div className="form-group">
              <label htmlFor="email" className="label-com-asterisco">
                E-mail *
              </label>
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
                <span className="input-icon">
                  <Mail size={20} color="#000" />
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="senha" className="label-com-asterisco">
                Senha *
              </label>
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
                  {showPassword ? (
                    <EyeOff size={20} color="#000" />
                  ) : (
                    <Eye size={20} color="#000" />
                  )}
                </span>
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="button" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </div>

            <div className="cadastro-link">
              Não tem uma conta? <a href="/telaCadastro">Cadastre-se</a>
            </div>

            <div className="forgot-password-link">
              <a href="/esqueci-senha">Esqueci minha senha</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
