"use client";

import { Phone } from 'lucide-react';

// Função auxiliar para aplicar a máscara: (XX) XXXXX-XXXX
const applyPhoneMask = (value) => {
    const rawValue = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    let formattedValue = '';
    if (rawValue.length > 0) {
      formattedValue += `(${rawValue.substring(0, 2)}`;
    }
    if (rawValue.length > 2) {
      formattedValue += `) ${rawValue.substring(2, 7)}`;
    }
    if (rawValue.length > 7) {
      formattedValue += `-${rawValue.substring(7, 11)}`;
    }
    return formattedValue;
};

// Componente de Input de Telefone
export default function PhoneInput({ telefone, setTelefone, telefoneError, setTelefoneError }) {
    
    // Função de Validação: Checa se tem 10 ou 11 dígitos
    const validateTelefone = (value) => {
        const cleanValue = value.replace(/\D/g, ''); 
        const isValid = cleanValue.length === 10 || cleanValue.length === 11;
        
        if (!isValid) {
            setTelefoneError('O telefone deve ter 10 ou 11 dígitos (com DDD).');
            return false;
        }
        setTelefoneError('');
        return true;
    };

    const handleTelefoneChange = (e) => {
        const formattedValue = applyPhoneMask(e.target.value);
        setTelefone(formattedValue);
        setTelefoneError('');
    };

    return (
        <div className="form-group">
            <label htmlFor="telefone" className="label-com-asterisco">Telefone *</label>
            <div className="input-icon-container">
                <input
                    type="tel" 
                    id="telefone"
                    className={`input-field ${telefoneError ? 'input-error' : ''}`}
                    placeholder="(XX) XXXXX-XXXX"
                    value={telefone}
                    onChange={handleTelefoneChange} 
                    onBlur={() => validateTelefone(telefone)} 
                    required
                    maxLength={15} 
                />
                <span className="input-icon"><Phone size={25} color="#000" /></span>
            </div>
            {telefoneError && <p className="error-message">{telefoneError}</p>} 
        </div>
    );
}