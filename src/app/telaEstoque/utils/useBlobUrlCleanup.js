// utils/useBlobUrlCleanup.js

import { useEffect } from 'react';

// Hook para lidar com a limpeza (revogação) de Blob URLs
export const useBlobUrlCleanup = (url) => {
    // A função de retorno é a função de limpeza (cleanup)
    useEffect(() => {
        return () => {
            if (url && typeof url === 'string' && url.startsWith('blob:')) {
                // Libera a URL de objeto da memória do navegador
                URL.revokeObjectURL(url);
            }
        };
    }, [url]); // Executa a limpeza sempre que a URL mudar
};