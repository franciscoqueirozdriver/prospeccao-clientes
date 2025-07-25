"use client";
import { useEffect, useState } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState({ segmento: "", porte: "", estado: "", cidade: "" });

  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  const segmentos = [...new Set(clientes.map((c) => c.segmento))];
  const portes = [...new Set(clientes.map((c) => c.porte))];
  const estados = [...new Set(clientes.map((c) => c.estado))];
  const cidades = [...new Set(clientes.map((c) => c.cidade))];

  const filtrados = clientes.filter((c) => {
    return (
      (!filtro.segmento || c.segmento === filtro.segmento) &&
      (!filtro.porte || c.porte === filtro.porte) &&
      (!filtro.estado || c.estado === filtro.estado) &&
      (!filtro.cidade || c.cidade === filtro.cidade)
    );
  });

  const atualizarFiltro = (campo) => (e) => setFiltro({ ...filtro, [campo]: e.target.value });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <select value={filtro.segmento} onChange={atualizarFiltro("segmento")} className="p-2 border rounded">
          <option value="">Todos os segmentos</option>
          {segmentos.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select value={filtro.porte} onChange={atualizarFiltro("porte")} className="p-2 border rounded">
          <option value="">Todos os portes</option>
          {portes.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select value={filtro.estado} onChange={atualizarFiltro("estado")} className="p-2 border rounded">
          <option value="">Todos os estados</option>
          {estados.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <select value={filtro.cidade} onChange={atualizarFiltro("cidade")} className="p-2 border rounded">
          <option value="">Todas as cidades</option>
          {cidades.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((c, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg">{c.empresa}</h3>
            <p>Segmento: {c.segmento}</p>
            <p>Porte: {c.porte}</p>
            <p>Estado: {c.estado}</p>
            <p>Cidade: {c.cidade}</p>
            <p>Contato: {c.contato}</p>
            <p>Cargo: {c.cargo}</p>
            <p>Telefone: {c.telefone}</p>
            <p>Email: {c.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
