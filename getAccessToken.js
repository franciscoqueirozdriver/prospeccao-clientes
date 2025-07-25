import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('client_id', process.env.AZURE_AD_CLIENT_ID);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', process.env.AZURE_AD_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const tokenRes = await fetch(
    `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    }
  );

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error('❌ Erro ao obter token:', tokenData);
    process.exit(1);
  }

  console.log('✅ Access Token gerado com sucesso');
  return tokenData.access_token;
}

async function getDriveId(token) {
  const res = await fetch('https://graph.microsoft.com/v1.0/drives', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.value || data.value.length === 0) {
    console.error('❌ Nenhum drive encontrado:', data);
    process.exit(1);
  }
  console.log(`📂 Drive encontrado: ${data.value[0].name}`);
  return data.value[0].id;
}

async function getFileInfo() {
  const token = await getAccessToken();
  const driveId = await getDriveId(token);

  const fileUrl = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/data/deals.xlsx`;

  // 1️⃣ Info básica do arquivo
  const res = await fetch(fileUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const fileData = await res.json();
  console.log('📂 Dados do arquivo:');
  console.log(JSON.stringify(fileData, null, 2));

  // 2️⃣ Abas (worksheets)
  const wsUrl = fileUrl + ':/workbook/worksheets';
  const wsRes = await fetch(wsUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const wsData = await wsRes.json();
  console.log('📑 Abas da planilha:');
  console.log(JSON.stringify(wsData, null, 2));
}

getFileInfo();

