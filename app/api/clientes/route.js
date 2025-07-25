import { NextResponse } from 'next/server';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import * as XLSX from 'xlsx';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('headers', req.headers);

  try {
    // Placeholder: should fetch from OneDrive using session.accessToken
    const workbook = XLSX.readFile('data/deals.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { range: 'A1:BW3000' });
    console.log('first 5 rows', rows.slice(0,5));

    const mapped = rows.map((row) => {
      const cliente = {
        empresa: row['Organização - Nome'] || 'Não Informado',
        contato: row['Negócio - Pessoa de contato'] || 'Não Informado',
        segmento: row['Organização - Segmento'] || 'Não Informado',
        porte: row['Organização - Tamanho da empresa'] || 'Não Informado',
        estado: row['uf'] || 'Não Informado',
        cidade: row['cidade_estimada'] || 'Não Informado',
        telefone: row['Pessoa - Telefone'] || row['Pessoa - Celular'] || 'Não Informado',
        email: row['Pessoa - Email - Work'] || 'Não Informado',
        cargo: row['Pessoa - Cargo'] || 'Não Informado'
      };
      Object.entries(cliente).forEach(([k,v]) => {
        if (v === undefined) console.log('Campo indefinido', k, row);
      });
      return cliente;
    });

    return NextResponse.json(mapped);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao ler planilha' }, { status: 500 });
  }
}
