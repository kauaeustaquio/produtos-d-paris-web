"use client";

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Função de Validação da Complexidade da Senha (Exportada para uso no handleSubmit)
export const validatePasswordComplexity = (password) => {
    const minLength = 6;
    // 🟢 NOVO: Checa se há pelo menos UMA letra maiúscula
    const hasUpperCase = /[A-Z]/.test(password); 
    // 🟢 NOVO: Checa se há pelo menos UMA letra minúscula
    const hasLowerCase = /[a-z]/.test(password); 
    const hasNumber = /[0-9]/.test(password);
    // Caracteres especiais obrigatórios: @, !, #, $, %, ^, &, *, _
    const hasSpecialChar = /[@!#$%^&*_]/.test(password); 

    const errors = [];

    if (password.length < minLength) {
        errors.push("Mínimo de 6 caracteres.");
    }
    // 🟢 Adiciona a nova regra: Maiúscula
    if (!hasUpperCase) {
        errors.push("Pelo menos 1 letra maiúscula.");
    }
    // 🟢 Adiciona a nova regra: Minúscula
    if (!hasLowerCase) {
        errors.push("Pelo menos 1 letra minúscula.");
    }
    if (!hasNumber) {
        errors.push("Pelo menos 1 número.");
    }
    if (!hasSpecialChar) {
        errors.push("Pelo menos 1 caractere especial (@, !, #, $, etc.).");
    }

    // A validação anterior 'hasLetter' (que checava apenas a presença de qualquer letra)
    // é implicitamente coberta por hasUpperCase e hasLowerCase. 
    // Mantenho a função original limpa das regras antigas.

    return errors;
};

export default function PasswordInput({ label, id, value, onChange, showPassword, toggleVisibility, required = true }) {
    const [complexityErrors, setComplexityErrors] = useState([]);
    
    // Aplica a validação apenas no campo principal 'senha' no momento do blur
    const handleBlur = () => {
        if (id === 'senha') { 
            const errors = validatePasswordComplexity(value);
            setComplexityErrors(errors);
        } else {
            setComplexityErrors([]);
        }
    };
    
    const handleChange = (e) => {
        onChange(e);
        // Limpa os erros de feedback enquanto o usuário digita
        if (complexityErrors.length > 0) {
            setComplexityErrors([]);
        }
    };

    const isError = id === 'senha' && complexityErrors.length > 0;

    return (
        <div className="form-group">
            <label htmlFor={id} className="label-com-asterisco">{label}</label>
            <div className="input-icon-container">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    className={`input-field ${isError ? 'input-error' : ''}`}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={required}
                />
                <span className="input-icon" onClick={toggleVisibility}>
                    {showPassword ? <EyeOff size={25} color="#000" /> : <Eye size={25} color="#000" />}
                </span>
            </div>
            
            {/* Exibe os erros de complexidade (apenas para o campo 'senha') */}
            {id === 'senha' && complexityErrors.length > 0 && (
                <div className="error-messages-container">
                    <p className="error-title">A senha deve ter:</p>
                    <ul>
                        {complexityErrors.map((error, index) => (
                            <li key={index} className="error-message">{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}