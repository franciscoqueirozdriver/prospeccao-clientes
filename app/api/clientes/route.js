import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import * as XLSX from "xlsx";

export async function GET(req) {
  console.log("📥 Incoming request headers:", Object.fromEntries(req.headers));

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      console.error("❌ No access token found");
      return new Response(JSON.stringify([]));
    }

    const token = session.accessToken;
    const fileUrl =
      "https://graph.microsoft.com/v1.0/me/drive/root:/data/deals.xlsx:/content";

    const fileRes = await fetch(fileUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const arrayBuffer = await fileRes.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      range: "A1:BW3000",
    });

    if (!rows.length) {
      console.warn("⚠️ No rows found in spreadsheet");
      return new Response(JSON.stringify([]));
    }

    console.log("📌 Headers detected:", Object.keys(rows[0]));

    const clientes = rows.map((row, idx) => {
      const cliente = {
        empresa: row["Organização - Nome"],
        contato: row["Negócio - Pessoa de contato"],
        segmento: row["Organização - Segmento"],
        porte: row["Organização - Tamanho da empresa"],
        estado: row["uf"],
        cidade: row["cidade_estimada"],
        telefone: row["Pessoa - Telefone"] || row["Pessoa - Celular"],
        email: row["Pessoa - Email - Work"],
        cargo: row["Pessoa - Cargo"] || "Não Informado",
      };

      for (const [key, value] of Object.entries(cliente)) {
        if (value === undefined) {
          console.log(`⚠️ Field ${key} undefined at row ${idx + 2}`);
        }
      }

      return cliente;
    });

    console.log("✅ First processed rows:", clientes.slice(0, 5));

    return new Response(JSON.stringify(clientes));
  } catch (error) {
    console.error("❌ Error reading spreadsheet:", error);
    return new Response(JSON.stringify([]));
  }
}
