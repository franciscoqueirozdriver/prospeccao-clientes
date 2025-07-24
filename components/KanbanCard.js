export default function KanbanCard({ lead }) {
  return (
    <div className="border rounded p-2 bg-white dark:bg-gray-700 shadow-sm">
      <p className="font-medium">{lead.empresa}</p>
      <p className="text-xs text-gray-500 dark:text-gray-300">{lead.contato}</p>
    </div>
  );
}
