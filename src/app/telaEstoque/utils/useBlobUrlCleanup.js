// utils/useBlobUrlCleanup.js

import { useEffect } from 'react';

/**
 * Hook para limpar automaticamente URLs do tipo Blob quando o componente é desmontado
 * ou quando a própria URL mudar.
 *
 * @param {string} url - URL gerada por URL.createObjectURL(...)
 */
export const useBlobUrlCleanup = (url) => {
    useEffect(() => {
        // Função executada no unmount OU quando a URL mudar
        return () => {
            if (url && typeof url === 'string' && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        };
    }, [url]);
};
