import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  console.log("\ud83d\udd0d [API] Iniciando leitura da planilha do OneDrive...");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      console.error("\u274c Nenhum token de acesso encontrado");
      return new Response(JSON.stringify([]), { status: 401 });
    }

    const token = session.accessToken;
    const filePath = "/data/deals.xlsx";

    const rangeRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root:${filePath}:/workbook/worksheets('Sheet1')/range(address='A1:BW3000')`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const rangeData = await rangeRes.json();
    const rows = rangeData.values || [];

    if (rows.length < 2) {
      console.warn("\u26a0\ufe0f Nenhum dado encontrado na planilha");
      return new Response(JSON.stringify([]));
    }

    const headers = rows[0];
    console.log("\ud83d\udccc Cabe\u00e7alhos detectados:", headers);

    const clientes = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i]));

      const cliente = {
        empresa: obj["Organiza\u00e7\u00e3o - Nome"] || "N\u00e3o Informado",
        contato: obj["Neg\u00f3cio - Pessoa de contato"] || "N\u00e3o Informado",
        segmento: obj["Organiza\u00e7\u00e3o - Segmento"] || "N\u00e3o Informado",
        porte: obj["Organiza\u00e7\u00e3o - Tamanho da empresa"] || "N\u00e3o Informado",
        estado: obj["uf"] || "N\u00e3o Informado",
        cidade: obj["cidade_estimada"] || "N\u00e3o Informado",
        telefone: obj["Pessoa - Telefone"] || obj["Pessoa - Celular"] || "N\u00e3o Informado",
        email: obj["Pessoa - Email - Work"] || "N\u00e3o Informado",
        cargo: obj["Pessoa - Cargo"] || "N\u00e3o Informado",
      };

      Object.entries(cliente).forEach(([k, v]) => {
        if (v === undefined) console.log(`\u26a0\ufe0f Campo indefinido: ${k}`, obj);
      });

      return cliente;
    });

    console.log("\ud83d\udccc Primeiros clientes:", clientes.slice(0, 5));

    return new Response(JSON.stringify(clientes));
  } catch (error) {
    console.error("\u274c Erro ao ler a planilha do OneDrive:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}
