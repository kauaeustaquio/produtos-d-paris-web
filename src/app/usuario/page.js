import db from "@/lib/db";

export default async () => {
  // Definindo um estado de alunos
  let alunos = [];

  try {
    // Tentando buscar os dados dos alunos
    const result = await db.query("SELECT * FROM usuario");
    alunos = result.rows; // Supondo que a resposta tem uma propriedade `rows`
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
  }

  return (
    <>
      <h1>Lista de alunos</h1>
      <div>
        {
          alunos.length > 0 ? (
            alunos.map(a => (
              <div key={a.id}>
                {a.nome} faz parte do projeto {a.cargo}
              </div>
            ))
          ) : (
            <p>Não há alunos cadastrados.</p>
          )
        }
      </div>
    </>
  );
};
