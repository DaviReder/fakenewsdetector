// src/app/api/analisar/route.js (ou app/api/analisar/route.js)

import { NextResponse } from "next/server";

export async function POST(req) {
  const { texto } = await req.json();
  console.log("Recebi POST com texto:", texto);

  // Aqui você chama a Gemini etc...
  // Exemplo de resposta dummy:
  return NextResponse.json({ resultado: "OK", recebido: texto });
}

export async function GET() {
  return NextResponse.json({ mensagem: "Use POST para analisar" });
}
