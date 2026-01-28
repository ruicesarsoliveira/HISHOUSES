
import { GoogleGenAI } from "@google/genai";
import { PointRecord } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateHouseSummary(houseName: string, records: PointRecord[]) {
  const pointsTotal = records.reduce((acc, curr) => acc + curr.points, 0);
  const prompt = `
    Aja como um narrador épico da competição de casas "H.I.S Houses". 
    A ${houseName} tem atualmente ${pointsTotal} pontos. 
    As últimas ações registradas foram: ${records.slice(-3).map(r => r.reason).join(', ')}.
    Crie uma frase curta e motivacional (máximo 20 palavras) para inspirar a casa a continuar se esforçando no sistema H.I.S Houses.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Continue firmes no propósito!";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "O sucesso é a soma de pequenos esforços repetidos dia após dia!";
  }
}

export async function checkReasonValidity(reason: string) {
  const prompt = `
    Analise a seguinte justificativa para ganhar pontos no sistema de casas escolar "H.I.S Houses": "${reason}".
    Se a justificativa for algo positivo relacionado a comportamento, notas, limpeza ou colaboração, retorne "positivo".
    Se for algo negativo ou ofensivo, retorne "negativo".
    Responda apenas com a palavra.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim().toLowerCase() === 'positivo';
  } catch (error) {
    return true; // Default to true if AI fails
  }
}
