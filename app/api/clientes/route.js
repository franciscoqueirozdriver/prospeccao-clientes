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
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rows.length) {
      console.warn("⚠️ No rows found in spreadsheet");
      return new Response(JSON.stringify([]));
    }

    console.log("📌 Headers detected:", Object.keys(rows[0]));

    const clientes = rows.map((row, idx) => {
      const cliente = {
        company: row["Organização - Nome"],
        contact: row["Negócio - Pessoa de contato"],
        segment: row["Organização - Segmento"],
        size: row["Organização - Tamanho da empresa"],
        state: row["uf"],
        city: row["cidade_estimada"],
        phone: row["Pessoa - Telefone"] || row["Pessoa - Celular"],
        email: row["Pessoa - Email - Work"],
        role: row["Pessoa - Cargo"] || "Not Provided",
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
