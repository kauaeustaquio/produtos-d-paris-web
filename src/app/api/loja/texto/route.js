import { NextResponse } from "next/server";
import db from "@/lib/db";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9()\-\s+]{8,}$/;

// =======================
// GET – buscar dados salvos
// =======================
export async function GET() {
  try {
    const result = await db.query(
      `SELECT 
        main_activity,
        address_street,
        address_city,
        address_cep,
        phone_main,
        phone_secondary,
        email
       FROM store_config
       WHERE id = 1`
    );

    const data = result.rows[0];

    return NextResponse.json({
      company_name: "PRODUTOS D' PARIS",
      aboutText: data.main_activity,
      location: {
        street: data.address_street,
        city_state: data.address_city,
        zip: data.address_cep,
      },
      contact: {
        phone1: data.phone_main,
        phone2: data.phone_secondary,
        email: data.email,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}

// =======================
// POST – salvar dados
// =======================
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
      await db.query(
        `UPDATE store_config
         SET address_street = $1,
             address_city = $2,
             address_cep = $3
         WHERE id = 1`,
        [value.street, value.city_state, value.zip]
      );
    }

    if (field === "contact") {
      if (!emailRegex.test(value.email)) {
        return NextResponse.json(
          { error: "Email inválido" },
          { status: 400 }
        );
      }

      if (!phoneRegex.test(value.phone1)) {
        return NextResponse.json(
          { error: "Telefone inválido" },
          { status: 400 }
        );
      }

      await db.query(
        `UPDATE store_config
         SET phone_main = $1,
             phone_secondary = $2,
             email = $3
         WHERE id = 1`,
        [value.phone1, value.phone2, value.email]
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
