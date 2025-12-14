import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await db.query(
      "SELECT * FROM store_config WHERE id = 1"
    );

    const store = rows[0];

    return NextResponse.json({
      company_name: store.company_name,
      aboutText: store.main_activity,
      location: {
        street: store.address_street,
        city_state: store.address_city,
        zip: store.address_cep,
      },
      contact: {
        phone1: store.phone_main,
        phone2: store.phone_secondary,
        email: store.email,
      },
      logo_url: store.logo_url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar dados da loja" },
      { status: 500 }
    );
  }
}
