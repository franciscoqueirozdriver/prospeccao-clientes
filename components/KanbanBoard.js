import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';
import { useState } from 'react';

const fases = [
  'Base Fria',
  'Contato Inicial',
  'Primeira Conversa',
  'Levantamento',
  'Proposta Enviada',
  'Follow-up',
  'Pronto para CRM',
];

function DraggableCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: lead.empresa });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="mb-2 cursor-move">
      <KanbanCard lead={lead} />
    </div>
  );
}

function DroppableColumn({ fase, children, onDrop }) {
  const { isOver, setNodeRef } = useDroppable({ id: fase });
  const style = isOver ? { backgroundColor: '#e2e8f0' } : undefined;
  return (
    <div ref={setNodeRef} style={style} className="p-2 w-64 min-h-32 bg-gray-100 dark:bg-gray-800 rounded">
      <h4 className="font-semibold mb-2 text-sm">{fase}</h4>
      {children}
    </div>
  );
}

export default function KanbanBoard({ leads, onMove }) {
  const [items, setItems] = useState(leads);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over && active) {
      setItems((prev) =>
        prev.map((l) =>
          l.empresa === active.id ? { ...l, etapa_kanban: over.id } : l
        )
      );
      onMove && onMove(active.id, over.id);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-auto">
        {fases.map((fase) => (
          <DroppableColumn key={fase} fase={fase}>
            {items.filter((i) => i.etapa_kanban === fase).map((lead) => (
              <DraggableCard key={lead.empresa} lead={lead} />
            ))}
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}
