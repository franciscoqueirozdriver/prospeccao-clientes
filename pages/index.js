import { useState } from 'react';
import clientes from '../data/clientes.json';
import ClienteCard from '../components/ClienteCard';
import Filtros from '../components/Filtros';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [lista, setLista] = useState(clientes);

  const segmentos = Array.from(new Set(clientes.map((c) => c.segmento)));
  const estados = Array.from(new Set(clientes.map((c) => c.estado)));
  const cidades = Array.from(new Set(clientes.map((c) => c.cidade)));

  const filtrar = ({ busca, segmento, estado, cidade }) => {
    let nova = clientes;
    if (busca) {
      nova = nova.filter((c) => c.empresa.toLowerCase().includes(busca.toLowerCase()));
    }
    if (segmento) nova = nova.filter((c) => c.segmento === segmento);
    if (estado) nova = nova.filter((c) => c.estado === estado);
    if (cidade) nova = nova.filter((c) => c.cidade === cidade);
    setLista(nova);
  };

  return (
    <div className="p-4 space-y-4">
      <Head>
        <title>Lista de Clientes</title>
      </Head>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Link href="/kanban" className="text-blue-500">Ir para Kanban</Link>
      </div>
      <Filtros segmentos={segmentos} estados={estados} cidades={cidades} onFiltrar={filtrar} />
      <div className="grid md:grid-cols-2 gap-4">
        {lista.map((c) => (
          <ClienteCard key={c.empresa} cliente={c} />
        ))}
      </div>
    </div>
  );
}
