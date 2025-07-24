export default function ClienteCard({ cliente }) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white dark:bg-gray-800">
      <h3 className="font-semibold text-lg">{cliente.empresa}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {cliente.segmento} - {cliente.cidade}/{cliente.estado}
      </p>
      <p className="mt-2">
        <a href={`tel:${cliente.telefone_comercial}`}>{cliente.telefone_comercial}</a>
        {" | "}
        <a href={`mailto:${cliente.email}`}>{cliente.email}</a>
      </p>
      <p className="mt-1 text-sm">Etapa: {cliente.etapa_kanban}</p>
    </div>
  );
}
