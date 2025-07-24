import { useState } from 'react';

export default function Filtros({ segmentos, estados, cidades, onFiltrar }) {
  const [busca, setBusca] = useState('');
  const [segmento, setSegmento] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');

  const filtrar = () => {
    onFiltrar({ busca, segmento, estado, cidade });
  };

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Buscar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="border p-2 w-full"
      />
      <select value={segmento} onChange={(e) => setSegmento(e.target.value)} className="border p-2 w-full">
        <option value="">Todos os segmentos</option>
        {segmentos.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border p-2 w-full">
        <option value="">Todos os estados</option>
        {estados.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select value={cidade} onChange={(e) => setCidade(e.target.value)} className="border p-2 w-full">
        <option value="">Todas as cidades</option>
        {cidades.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button onClick={filtrar} className="bg-blue-500 text-white px-4 py-2 rounded">Filtrar</button>
    </div>
  );
}
