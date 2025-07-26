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

        setSegments([...new Set(data.map((c) => c.segment).filter(Boolean))]);
        setSizes([...new Set(data.map((c) => c.size).filter(Boolean))]);
        setStates([...new Set(data.map((c) => c.state).filter(Boolean))]);
        setCities([...new Set(data.map((c) => c.city).filter(Boolean))]);
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
          (!filterSegment || c.segment === filterSegment) &&
          (!filterSize || c.size === filterSize) &&
          (!filterState || c.state === filterState) &&
          (!filterCity || c.city === filterCity) &&
          (!search || c.company.toLowerCase().includes(term))
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
              {seg}
            </option>
          ))}
        </select>

        <select
          value={filterSize}
          onChange={(e) => setFilterSize(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os portes</option>
          {sizes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os estados</option>
          {states.map((e) => (
            <option key={e} value={e}>
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
            <h3 className="font-bold text-lg">{cliente.company}</h3>
            <p>Segmento: {cliente.segment || "Not Provided"}</p>
            <p>Porte: {cliente.size || "Not Provided"}</p>
            <p>Estado: {cliente.state || "Not Provided"}</p>
            <p>Cidade: {cliente.city || "Not Provided"}</p>
            <p>Contato: {cliente.contact || "Not Provided"}</p>
            <p>Cargo: {cliente.role}</p>
            <p>Telefone: {cliente.phone || "Not Provided"}</p>
            <p>Email: {cliente.email || "Not Provided"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

