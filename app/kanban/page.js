import { useEffect, useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import Link from 'next/link';
import Head from 'next/head';

export default function KanbanPage() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch('/api/clientes')
      .then((res) => res.json())
      .then(setLeads)
      .catch((err) => console.error('Erro ao carregar leads:', err));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Head>
        <title>Kanban de Pré-venda</title>
      </Head>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kanban</h1>
        <Link href="/" className="text-blue-500">Voltar para Lista</Link>
      </div>
      <KanbanBoard leads={leads} />
    </div>
  );
}
