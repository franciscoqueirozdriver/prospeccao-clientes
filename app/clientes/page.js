'use client';
import { useEffect, useState } from 'react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState({ segmento: '', porte: '', estado: '', cidade: '' });

  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  const segmentos = [...new Set(clientes.map(c => c.segmento))];
  const portes = [...new Set(clientes.map(c => c.porte))];
  const estados = [...new Set(clientes.map(c => c.estado))];
  const cidades = [...new Set(clientes.map(c => c.cidade))];

  const filtrados = clientes.filter(c => {
    return (!filtro.segmento || c.segmento === filtro.segmento)
      && (!filtro.porte || c.porte === filtro.porte)
      && (!filtro.estado || c.estado === filtro.estado)
      && (!filtro.cidade || c.cidade === filtro.cidade);
  });

  const atualizarFiltro = (campo) => (e) => setFiltro({ ...filtro, [campo]: e.target.value });

  return (
    <div>
      <h1>Clientes</h1>
      <div className="filtros">
        <select value={filtro.segmento} onChange={atualizarFiltro('segmento')}>
          <option value="">Segmento</option>
          {segmentos.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filtro.porte} onChange={atualizarFiltro('porte')}>
          <option value="">Porte</option>
          {portes.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filtro.estado} onChange={atualizarFiltro('estado')}>
          <option value="">Estado</option>
          {estados.map(e => <option key={e}>{e}</option>)}
        </select>
        <select value={filtro.cidade} onChange={atualizarFiltro('cidade')}>
          <option value="">Cidade</option>
          {cidades.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="cards">
        {filtrados.map((c, i) => (
          <div key={i} className="card">
            <h2>{c.empresa}</h2>
            <p>Segmento: {c.segmento}</p>
            <p>Porte: {c.porte}</p>
            <p>{c.estado} - {c.cidade}</p>
            <p>Contato: {c.contato} ({c.cargo})</p>
            <p>Telefone: {c.telefone}</p>
            <p>Email: {c.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
