"use client";
import { useState, useMemo, useEffect } from 'react';
import ClienteCard from '../components/ClienteCard';

export default function Home() {
  const [busca, setBusca] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState('');
  const [filtroPorte, setFiltroPorte] = useState('');
  const [clientes, setClientes] = useState([]);

  // 🔍 Filtros dinâmicos baseados nos clientes carregados
  const segmentos = useMemo(
    () => [...new Set(clientes.map((c) => c.segmento))].filter(Boolean),
    [clientes]
  );

  const portes = useMemo(
    () => [...new Set(clientes.map((c) => c.porte))].filter(Boolean),
    [clientes]
  );

  // 🔄 Carrega clientes via API
  useEffect(() => {
    fetch('/api/clientes')
      .then((res) => res.json())
      .then(setClientes)
      .catch((err) => console.error('Erro ao carregar clientes:', err));
  }, []);

  // 🔍 Filtro de busca e seleção de segmento/porte
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const buscaLower = busca.toLowerCase();
      const matchBusca =
        !busca ||
        cliente.empresa.toLowerCase().includes(buscaLower) ||
        (cliente.contato && cliente.contato.toLowerCase().includes(buscaLower));

      const matchSegmento = !filtroSegmento || cliente.segmento === filtroSegmento;
      const matchPorte = !filtroPorte || cliente.porte === filtroPorte;

      return matchBusca && matchSegmento && matchPorte;
    });
  }, [clientes, busca, filtroSegmento, filtroPorte]);

  // 🔄 Função para mover cliente para o kanban
  const moverClienteParaKanban = (clienteSelecionado) => {
    setClientes((clientesAnteriores) =>
      clientesAnteriores.map((c) =>
        c.empresa === clienteSelecionado.empresa
          ? { ...c, etapa: 'Pré-venda' }
          : c
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Prospecção de Clientes</h1>

      {/* 🔍 Campo de busca */}
      <input
        type="text"
        placeholder="Buscar por empresa ou contato..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

      {/* 🔽 Filtros */}
      <div className="flex gap-2 mb-4">
        <select
          value={filtroSegmento}
          onChange={(e) => setFiltroSegmento(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos os Segmentos</option>
          {segmentos.map((seg) => (
            <option key={seg} value={seg}>{seg}</option>
          ))}
        </select>

        <select
          value={filtroPorte}
          onChange={(e) => setFiltroPorte(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos os Portes</option>
          {portes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* 📌 Listagem de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((c) => (
          <ClienteCard
            key={c.empresa}
            cliente={c}
            moverParaKanban={() => moverClienteParaKanban(c)}
          />
        ))}
      </div>
    </div>
  );
}

