import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

export default function handler(req, res) {
  return NextAuth(req, res, authOptions);
}

export { authOptions }; // ✅ Exporta para que outras rotas (como a API de clientes) possam usar

