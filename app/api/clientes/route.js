import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth"; // ✅ Caminho relativo correto

export async function GET() {
  console.log("🔍 [API] Iniciando leitura da planilha do OneDrive...");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      console.error("❌ Nenhum token de acesso encontrado");
      return new Response(JSON.stringify([])); // ✅ Retorna array vazio
    }

    const token = session.accessToken;
    const filePath = "/data/deals.xlsx";

    const rangeRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root:${filePath}:/workbook/worksheets('Sheet1')/range(address='A1:H3000')`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const rangeData = await rangeRes.json();
    const rows = rangeData.values || [];

    if (rows.length < 2) {
      console.warn("⚠️ Nenhum dado encontrado na planilha");
      return new Response(JSON.stringify([]));
    }

    const headers = rows[0];
    console.log("📌 Cabeçalhos detectados:", headers);

    const clientes = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i]));
      return {
        empresa: obj["Organização - Nome"] || "",
        contato: obj["Negócio - Pessoa de contato"] || "",
        segmento: obj["Organização - Segmento"] || "",
        porte: obj["Organização - Tamanho da empresa"] || "",
        estado: obj["uf"] || "",
        cidade: obj["cidade_estimada"] || "",
        cargo: obj["Pessoa - Cargo"] || "Não Informado",
        telefone: obj["Pessoa - Telefone"] || obj["Pessoa - Celular"] || "",
        email: obj["Pessoa - Email - Work"] || "",
      };
    });

    console.log("✅ Clientes processados:", clientes.slice(0, 3));

    return new Response(JSON.stringify(clientes));
  } catch (error) {
    console.error("❌ Erro ao ler a planilha do OneDrive:", error);
    return new Response(JSON.stringify([]));
  }
}

