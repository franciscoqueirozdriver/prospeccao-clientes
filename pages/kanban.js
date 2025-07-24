import leads from '../data/clientes.json';
import KanbanBoard from '../components/KanbanBoard';
import Link from 'next/link';
import Head from 'next/head';

export default function KanbanPage() {
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
