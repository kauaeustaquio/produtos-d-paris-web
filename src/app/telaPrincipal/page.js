import db from "@/lib/db";

export default async function ProdutosdParis() {
  const usuario = await db.query("select * from usuario");

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Top bar */}
        <div style={{ width: "100%", height: "56px", backgroundColor: "#D9D9D9", position: "relative" }}>
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              padding: "0 16px",
            }}
          >
            <input
              type="search"
              placeholder="Pesquisar..."
              style={{
                width: "320px",
                maxWidth: "100%",
                height: "32px",
                borderRadius: "9999px",
                padding: "0 16px",
                color: "#9CA3AF",
                border: "none",
                outline: "none",
                fontSize: "14px",
                fontFamily: "Roboto, sans-serif",
              }}
            />
            <button
              aria-label="Limpar pesquisa"
              style={{
                position: "absolute",
                right: "calc(50% + 160px - 24px)",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#9CA3AF",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <i className="fas fa-times" />
            </button>
            <div
              style={{
                position: "absolute",
                right: "64px",
                display: "flex",
                gap: "32px",
                color: "#4B5563",
                fontSize: "20px",
              }}
            >
              <button aria-label="Informações" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                <i className="fas fa-info-circle" />
              </button>
              <button aria-label="Carrinho" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                <i className="fas fa-shopping-cart" />
              </button>
              <button aria-label="Usuário" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                <i className="fas fa-user" />
              </button>
            </div>
          </div>
        </div>

        {/* Banner */}
        <section style={{ maxWidth: "1120px", margin: "0 auto", width: "100%" }}>
          <img
            src="https://storage.googleapis.com/a1aa/image/22f16780-677b-4278-7c13-d89f7571ab27.jpg"
            alt="Banner with Eiffel Tower logo and Produtos d'Paris text in gold on dark textured background"
            style={{ width: "100%", height: "200px", objectFit: "cover", userSelect: "none" }}
            draggable={false}
          />
        </section>

        {/* Navigation */}
        <nav style={{ maxWidth: "1120px", margin: "0 auto", width: "100%", marginTop: "32px", padding: "0 16px" }}>
          <ul
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid #D1D5DB",
              borderBottom: "1px solid #D1D5DB",
              color: "#1F2937",
              fontSize: "14px",
              fontWeight: "400",
              listStyle: "none",
              padding: 0,
              margin: 0,
              divideStyle: "solid",
              divideColor: "#D1D5DB",
              divideWidth: "1px",
            }}
          >
            <li
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0",
                borderRight: "1px solid #D1D5DB",
                fontWeight: "600",
                color: "#000000",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
              aria-current="page"
            >
              <span
                aria-hidden="true"
                style={{
                  backgroundColor: "#E5E7EB",
                  borderRadius: "9999px",
                  padding: "12px",
                  display: "inline-block",
                  fontSize: "20px",
                }}
              >
                <i className="fas fa-home" />
              </span>
              Inicio
            </li>
            <li
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0",
                borderRight: "1px solid #D1D5DB",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                color: "#1F2937",
                fontWeight: "400",
                fontSize: "14px",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "20px" }}>
                <i className="fas fa-box" />
              </span>
              Categorias
            </li>
            <li
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0",
                borderRight: "1px solid #D1D5DB",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                color: "#1F2937",
                fontWeight: "400",
                fontSize: "14px",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "20px" }}>
                <i className="fas fa-tag" />
              </span>
              Promoções
            </li>
            <li
              style={{
                flex: 1,
                textAlign: "center",
                padding: "16px 0",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                color: "#1F2937",
                fontWeight: "400",
                fontSize: "14px",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: "20px" }}>
                <i className="fas fa-chart-line" />
              </span>
              Novidades
            </li>
          </ul>
        </nav>

        {/* Content */}
        <main style={{ maxWidth: "1120px", margin: "0 auto", width: "100%", marginTop: "32px", padding: "0 16px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Limpeza de Piscina */}
          <section>
            <h2
              style={{
                color: "#4B5563",
                fontSize: "14px",
                fontWeight: "400",
                borderBottom: "1px solid #D1D5DB",
                paddingBottom: "4px",
                marginBottom: "16px",
              }}
            >
              Limpeza de Piscina
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
              <div
                aria-label="Adicionar item Limpeza de Piscina"
                style={{
                  flexShrink: 0,
                  width: "120px",
                  height: "140px",
                  borderRadius: "12px",
                  backgroundColor: "#D1D5DB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-plus" style={{ fontSize: "24px", color: "#4B5563" }} />
              </div>
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
            </div>
          </section>

          {/* Limpeza para Carros */}
          <section>
            <h2
              style={{
                color: "#4B5563",
                fontSize: "14px",
                fontWeight: "400",
                borderBottom: "1px solid #D1D5DB",
                paddingBottom: "4px",
                marginBottom: "16px",
              }}
            >
              Limpeza para Carros
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
              <div style={{ flexShrink: 0, width: "120px", height: "140px", borderRadius: "12px", backgroundColor: "#D1D5DB" }} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

