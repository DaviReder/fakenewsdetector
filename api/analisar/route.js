import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// A instância da GoogleGenAI inicializa automaticamente,
// buscando a chave na variável de ambiente GEMINI_API_KEY.
// O nome desta variável deve ser exatamente esse, pois é o padrão da biblioteca.
const ai = new GoogleGenAI({});

/**
 * Esta função lida com requisições POST para a rota /api/analisar
 * e resolve o erro 405 que você estava recebendo.
 * @param {Request} req O objeto de requisição do Next.js.
 */
export async function POST(req) {
  try {
    // 1. Extrai o corpo da requisição para obter o 'texto'
    const { texto } = await req.json();

    if (!texto) {
      // Retorna 400 Bad Request se o campo 'texto' não for fornecido
      return NextResponse.json({ error: "O campo 'texto' é obrigatório no corpo da requisição." }, { status: 400 });
    }

    // Instrução de sistema para guiar o modelo na análise e validação
    const systemInstruction = "Você é um assistente de análise de notícias e fatos. Sua tarefa é analisar o 'texto' fornecido e fornecer uma avaliação concisa e embasada sobre sua veracidade e contexto. **Use a ferramenta de busca do Google (grounding) para fundamentar sua resposta**. O usuário quer a sua análise textual com base no que for encontrado na web.";

    // 2. Chama a API do Gemini com o Google Search grounding (para validação)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-09-2025",
      contents: [{ role: "user", parts: [{ text: `Analise a veracidade e o contexto da seguinte informação: "${texto}"` }] }],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], // Habilita o Google Search para fundamentação (Grounding)
      }
    });

    const generatedText = response.text;

    // Extrai as fontes de informação usadas pelo modelo
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingAttributions.map(attr => ({
        uri: attr.web.uri,
        title: attr.web.title
    })) || [];


    // 3. Retorna a análise e as fontes em formato JSON
    return NextResponse.json({
      analise: generatedText,
      fontes: groundingSources,
      status: "Sucesso"
    });

  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    // Retorna 500 Internal Server Error em caso de falha na API ou lógica
    return NextResponse.json({
      error: "Erro interno do servidor ao analisar a informação.",
      details: error.message
    }, { status: 500 });
  }
}

// Opcional: Para reforçar o erro 405 e ser mais explícito
export function GET() {
    return NextResponse.json({ error: "Método GET não permitido para esta rota. Use POST." }, { status: 405 });
}
