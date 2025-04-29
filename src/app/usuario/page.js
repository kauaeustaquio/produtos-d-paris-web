import db from "@/lib/db"
export default async () => {
    const alunos = await db.query("select * from usuario")
 return (<>
    <h1>Lista de alunos</h1>
    <div>
      {
         alunos.rows.map( 
            a => (
               <div key={a.id}>
                  {a.nome} faz parte do projeto {a.cargo}
               </div>
            ) 
         )
      }
   </div>
 </>);
}