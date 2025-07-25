"use client";
import { useState, useEffect } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroSegmento, setFiltroSegmento] = useState("");
  const [filtroPorte, setFiltroPorte] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");

  const [segmentos, setSegmentos] = useState([]);
  const [portes, setPortes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        const data = await res.json();

        setClientes(data);

        setSegmentos([...new Set(data.map(c => c.segmento).filter(Boolean))]);
        setPortes([...new Set(data.map(c => c.porte).filter(Boolean))]);
        setEstados([...new Set(data.map(c => c.estado).filter(Boolean))]);
        setCidades([...new Set(data.map(c => c.cidade).filter(Boolean))]);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }
    fetchClientes();
  }, []);

  const clientesFiltrados = Array.isArray(clientes) ? clientes.filter((c) => {
    const termoBusca = busca.toLowerCase();
    return (
      (!filtroSegmento || c.segmento === filtroSegmento) &&
      (!filtroPorte || c.porte === filtroPorte) &&
      (!filtroEstado || c.estado === filtroEstado) &&
      (!filtroCidade || c.cidade === filtroCidade) &&
      (!busca || c.empresa.toLowerCase().includes(termoBusca))
    );
  }) : [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="col-span-2 p-2 border rounded"
        />

        <select
          value={filtroSegmento}
          onChange={(e) => setFiltroSegmento(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os segmentos</option>
          {segmentos.map((seg) => (
            <option key={seg} value={seg}>{seg}</option>
          ))}
        </select>

        <select
          value={filtroPorte}
          onChange={(e) => setFiltroPorte(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os portes</option>
          {portes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os estados</option>
          {estados.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          value={filtroCidade}
          onChange={(e) => setFiltroCidade(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas as cidades</option>
          {cidades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((cliente, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg">{cliente.empresa}</h3>
            <p>Segmento: {cliente.segmento || "Não Informado"}</p>
            <p>Porte: {cliente.porte || "Não Informado"}</p>
            <p>Estado: {cliente.estado || "Não Informado"}</p>
            <p>Cidade: {cliente.cidade || "Não Informado"}</p>
            <p>Contato: {cliente.contato || "Não Informado"}</p>
            <p>Cargo: {cliente.cargo}</p>
            <p>Telefone: {cliente.telefone || "Não Informado"}</p>
            <p>Email: {cliente.email || "Não Informado"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

