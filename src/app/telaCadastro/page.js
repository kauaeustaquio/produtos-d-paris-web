import db from "@/lib/db";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");

return (
    <>
      {/* Link para a fonte Urbanist no Google Fonts */}
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600&display=swap" rel="stylesheet" />

    {/* Centralizando a caixa de cadastro*/}
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  // 100% da altura da tela
        backgroundColor: '#000',  // Fundo preto
        margin: 0
    }}>
    <div style={{
        width: '400px',  // Caixa mais fina (ajustado de 490px para 400px)
        height: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px',
    }}>
    {/* Aplicando a fonte Urbanist ao título */}
        <h2 style={{
        textAlign: 'center',
        fontSize: '24px',
        color: '#333',
        fontFamily: 'Urbanist, sans-serif',
        }}>
        Cadastre-se
        </h2>
        <form method="post" style={{ width: '100%' }}>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="nome" style={{ color: 'black' }}>Nome:</label>
            <input type="text" id="nome" style={{ width: '100%', padding: '10px', borderRadius: '25px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ color: 'black' }}>Email:</label>
            <input type="email" id="email" style={{ width: '100%', padding: '10px', borderRadius: '25px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="senha" style={{ color: 'black' }}>Senha:</label>
            <input type="password" id="senha" style={{ width: '100%', padding: '10px', borderRadius: '25px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="confirmaSenha" style={{ color: 'black' }}>Insira a senha novamente:</label>
            <input type="password" id="confirmaSenha" style={{ width: '100%', padding: '10px', borderRadius: '25px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="submit" style={{
            padding: '12px 20px',
            borderRadius: '25px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            }}>Cadastrar</button>
        </div>
        </form>
    </div>
    </div>
</>
);
}