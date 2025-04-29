import db from "@/lib/db";

export default async ({params}) => {
    const usuario = await db.query(
        "select * from usuario where id = " + params.id
    );
    return (
        <>
            <h1>Página do aluno: 
                {usuario.rows[1].nome}
            </h1>
            <p>O usuário faz parte do projeto:
                {usuario.rows[1].cargo}
            </p>
        </>
    )
}