import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401 });
  }

  const token = session.accessToken;
  const email = "fjaqueiroz@escoladotrabalhador40.com.br";
  const filePath = "/data/deals.xlsx";
  const sheetName = "Sheet1"; // nome da aba

  try {
    const rangeUrl = `https://graph.microsoft.com/v1.0/users/${email}/drive/root:${filePath}:/workbook/worksheets('${sheetName}')/range(address='A1:H20')`;

    const r = await fetch(rangeUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await r.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro ao ler planilha:", err);
    return new Response(JSON.stringify({ error: "Erro ao acessar dados" }), { status: 500 });
  }
}

