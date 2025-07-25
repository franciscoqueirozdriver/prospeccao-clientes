import fs from 'fs';
import path from 'path';
import { useState, useMemo } from 'react';
import ClienteCard from '../components/ClienteCard';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'clientes.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const clientesData = JSON.parse(jsonData);

  return {
    props: { clientesData },
  };
}

export default function Home({ clientesData }) {
  const [busca, setBusca] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState('');
  const [filtroPorte, setFiltroPorte] = useState('');
  const [clientes, setClientes] = useState(clientesData);

  const segmentos = useMemo(() => {
    return [...new Set(clientesData.map((c) => c.segmento))].filter(Boolean);
  }, [clientesData]);

  const portes = useMemo(() => {
    return [...new Set(clientesData.map((c) => c.porte))].filter(Boolean);
  }, [clientesData]);

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <a href="/kanban" className="text-sm text-blue-600 hover:underline">Ver Kanban</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por empresa ou contato"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="col-span-2 p-2 border rounded shadow-sm"
        />

        <select
          value={filtroSegmento}
          onChange={(e) => setFiltroSegmento(e.target.value)}
          className="p-2 border rounded shadow-sm"
        >
          <option value="">Todos os segmentos</option>
          {segmentos.map((seg) => (
            <option key={seg} value={seg}>{seg}</option>
          ))}
        </select>

        <select
          value={filtroPorte}
          onChange={(e) => setFiltroPorte(e.target.value)}
          className="p-2 border rounded shadow-sm"
        >
          <option value="">Todos os portes</option>
          {portes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((cliente, index) => (
          <ClienteCard
            key={index}
            cliente={cliente}
            onMoverParaKanban={moverClienteParaKanban}
          />
        ))}
      </div>
    </div>
  );
}

