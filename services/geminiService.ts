import { GoogleGenAI } from "@google/genai";
import { ABTest, TestStats } from "../types";

const getGeminiClient = () => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeTestResults = async (test: ABTest, stats: TestStats): Promise<string> => {
    const ai = getGeminiClient();
    if (!ai) return "Chave da API não configurada. Não é possível gerar insights.";

    // Format funnel events for the prompt
    let funnelText = "Dados do Funnel (Eventos Personalizados):\n";
    if (test.events && Object.keys(test.events).length > 0) {
        Object.entries(test.events).forEach(([event, data]) => {
            funnelText += `- Evento "${event}": Variante A (${data.A}), Variante B (${data.B})\n`;
        });
    } else {
        funnelText += "Nenhum evento de funil registrado além da conversão final.\n";
    }

    const prompt = `
      Analise os resultados deste teste A/B de uma landing page/quiz.
      
      Dados Gerais: "${test.name}"
      
      Variante A (Original):
      - URL: ${test.urlA}
      - Visitas Totais: ${test.visitsA}
      - Conversões Finais: ${test.conversionsA}
      - Taxa de Conversão Final: ${stats.conversionRateA.toFixed(2)}%
      
      Variante B (Desafiante):
      - URL: ${test.urlB}
      - Visitas Totais: ${test.visitsB}
      - Conversões Finais: ${test.conversionsB}
      - Taxa de Conversão Final: ${stats.conversionRateB.toFixed(2)}%
      
      ${funnelText}
      
      Vencedor Estatístico Aparente: ${stats.winner}
      
      Por favor, forneça uma análise estratégica focada em retenção e conversão (máximo 3 parágrafos).
      1. Qual variante retém mais usuários durante o funil (se houver dados de funil)? Identifique onde ocorre a maior "fuga" de leads.
      2. O Uplift da variante B justifica a mudança?
      3. Recomendação prática: Onde focar a otimização (Ex: Headline, Pergunta 2 do Quiz, Botão de Compra).
      
      Responda em Português do Brasil com um tom especialista em CRO (Conversion Rate Optimization).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Não foi possível gerar a análise.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Erro ao conectar com a IA para análise.";
    }
};