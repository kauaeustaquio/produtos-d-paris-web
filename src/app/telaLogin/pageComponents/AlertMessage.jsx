// telaLogin/pageComponents/AlertMessage.jsx
"use client";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';

export default function AlertMessage({ 
  type = "success",   // "success" ou "error"
  message = "",       // mensagem a ser exibida
  redirectToCadastro = false // se true, adiciona link para /telaCadastro
}) {
  const router = useRouter();

  if (!message) return null; // não exibe nada se não houver mensagem

  const handleCadastroClick = () => {
    router.push("/telaCadastro");
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={2} mb={2}>
      {type === "success" && (
        <Alert variant="filled" severity="success">
          {message}
        </Alert>
      )}
      {type === "error" && (
        <Alert variant="filled" severity="error">
          {message}{" "}
          {redirectToCadastro && (
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={handleCadastroClick}
            >
              Clique aqui para se cadastrar.
            </span>
          )}
        </Alert>
      )}
    </Stack>
  );
}
