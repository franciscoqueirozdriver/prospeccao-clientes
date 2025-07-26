
"use client";
import { useState, useEffect } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const [segments, setSegments] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("/api/clientes");
        const data = await res.json();

        setClientes(data);

        setSegments([...new Set(data.map((c) => c.segmento).filter(Boolean))]);
        setSizes([...new Set(data.map((c) => c.porte).filter(Boolean))]);
        setStates([...new Set(data.map((c) => c.estado).filter(Boolean))]);
        setCities([...new Set(data.map((c) => c.cidade).filter(Boolean))]);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    fetchClientes();
  }, []);

  const filtered = Array.isArray(clientes)
    ? clientes.filter((c) => {
        const term = search.toLowerCase();
        return (
          (!filterSegment || c.segmento === filterSegment) &&
          (!filterSize || c.porte === filterSize) &&
          (!filterState || c.estado === filterState) &&
          (!filterCity || c.cidade === filterCity) &&
          (!search || c.empresa.toLowerCase().includes(term))
        );
      })
    : [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="col-span-2 p-2 border rounded"
        />

        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os segmentos</option>
          {segments.map((seg) => (
            <option key={seg} value={seg}>
@@ -96,41 +96,41 @@ export default function ClientesPage() {
              {e}
            </option>
          ))}
        </select>

        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas as cidades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cliente, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow min-h-[200px] flex flex-col"
          >
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

