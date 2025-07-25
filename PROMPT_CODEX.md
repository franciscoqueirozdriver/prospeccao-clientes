# ✅ PROJETO: Sistema de Prospecção de Clientes (Next.js + App Router)

## 🎯 OBJETIVO
- Conectar e ler diretamente a planilha `deals.xlsx` no OneDrive.
- Autenticar via Azure AD (NextAuth).
- Adicionar filtros dinâmicos (Segmento, Porte, Estado, Cidade).
- Exibir cards de clientes com cargo/função, mantendo padrão de tamanho.
- Garantir funcionamento no App Router sem dependências antigas.
- Remover JSON local (usar sempre planilha).
- Preparar para deploy no Vercel.

---

## 📂 ESTRUTURA ATUAL
- App Router (`/app`)
- API de clientes: `app/api/clientes/route.js`
- Lib de autenticação: `lib/auth.js`
- Página de clientes: `app/clientes/page.js`
- Planilha: OneDrive `/data/deals.xlsx`
- **Sem `clientes.json`**

---

## ✅ TAREFAS PARA O CODEX

### 🔐 1. AUTENTICAÇÃO
- Garantir que `lib/auth.js` exporta `authOptions` corretamente.
- Ajustar `app/api/clientes/route.js` para importar de `lib/auth.js`.
- Corrigir `JWT_SESSION_ERROR` e garantir que `accessToken` é passado.
- Validar que `NEXTAUTH_SECRET`, `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` estão funcionando.

### 📊 2. LEITURA DA PLANILHA
- API `/api/clientes` deve ler `deals.xlsx` direto do OneDrive.
- Range: `A1:BW3000`
- Mapear campos:
  - `Organização - Nome` → empresa
  - `Negócio - Pessoa de contato` → contato
  - `Organização - Segmento` → segmento
  - `Organização - Tamanho da empresa` → porte
  - `uf` → estado
  - `cidade_estimada` → cidade
  - `Pessoa - Telefone` / `Pessoa - Celular` → telefone
  - `Pessoa - Email - Work` → email
  - `Pessoa - Cargo` → cargo (mostrar "Não Informado" se vazio)

- **Logs de depuração obrigatórios na API:**
  - Logar `headers` detectados.
  - Logar os **5 primeiros registros** lidos.
  - Logar quando algum campo mapeado estiver `undefined`.

### 🎨 3. FRONT-END (app/clientes/page.js)
- Exibir filtros: Segmento, Porte, Estado, Cidade (dinâmicos).
- Cards mostram: Empresa, Segmento, Porte, Estado, Cidade, Contato, Cargo, Telefone, Email.
- Usar `"Não Informado"` se campo vazio para manter padrão.
- Filtros devem atualizar em tempo real.

### 🚀 4. LIMPEZA E AJUSTES
- Garantir que **não existe mais `clientes.json`**.
- Verificar que todas as chamadas usam **planilha**.
- Remover imports quebrados de `/pages`.

### 🧪 5. TESTES
- Testar API `/api/clientes` → Deve retornar array de clientes com todos os campos.
- Testar filtros.
- Testar autenticação Azure AD e tokens.
- Testar integração OneDrive em produção.

---

## 🔄 6. PRONTO PARA DEPLOY
- Validar `.env.local` no Vercel.
- Subir para GitHub e configurar staging.

