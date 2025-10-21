// utils/formatters.js

export const formatarParaBRL = (valor) => {
    const valorNumerico = parseFloat(String(valor).replace(',', '.'));
    if (isNaN(valorNumerico)) return 'R$ 0,00';
    return `R$ ${valorNumerico.toFixed(2).replace('.', ',')}`;
};

export const calcularValorComDesconto = (valorOriginal, percentualDesconto) => {
    const valorNumerico = parseFloat(String(valorOriginal).replace(',', '.'));
    if (isNaN(valorNumerico) || percentualDesconto < 0 || percentualDesconto > 100) {
        return valorNumerico;
    }
    return valorNumerico * (1 - percentualDesconto / 100);
};