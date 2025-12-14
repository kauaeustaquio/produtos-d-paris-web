import db from "@/lib/db";
import { NextResponse } from "next/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

export async function POST(req) {
  try {
    const { field, value } = await req.json();

    if (field === "aboutText") {
      await db.query(
        "UPDATE store_config SET main_activity = $1 WHERE id = 1",
        [value]
      );
    }

    if (field === "location") {
      const loc = JSON.parse(value);
      await db.query(
        `UPDATE store_config
         SET address_street = $1,
             address_city = $2,
             address_cep = $3
         WHERE id = 1`,
        [loc.street, loc.city_state, loc.zip]
      );
    }

    if (field === "contact") {
      const c = JSON.parse(value);

      if (!emailRegex.test(c.email)) {
        return NextResponse.json(
          { error: "Email inválido" },
          { status: 400 }
        );
      }

      if (!phoneRegex.test(c.phone1)) {
        return NextResponse.json(
          { error: "Telefone inválido. Use (99) 99999-9999" },
          { status: 400 }
        );
      }

      await db.query(
        `UPDATE store_config
         SET phone_main = $1,
             phone_secondary = $2,
             email = $3
         WHERE id = 1`,
        [c.phone1, c.phone2, c.email]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao salvar dados" },
      { status: 500 }
    );
  }
}
