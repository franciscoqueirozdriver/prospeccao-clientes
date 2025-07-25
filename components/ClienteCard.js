import { useState } from 'react';

export default function ClienteCard({ cliente, onMoverParaKanban }) {
  const [foiMovido, setFoiMovido] = useState(false);

  const formatarWhatsAppLink = (numero) => {
    if (!numero) return null;
    const limpo = numero.replace(/\D/g, '');
    return `https://wa.me/55${limpo}`;
  };

  const handleDoubleClick = () => {
    if (cliente.etapa === 'Pré-venda') {
      alert('Este cliente já está na primeira etapa do Kanban.');
      return;
    }

    const confirmar = window.confirm(
      `Deseja mover "${cliente.empresa}" para a primeira etapa do Kanban?`
    );

    if (confirmar) {
      onMoverParaKanban(cliente);
      setFoiMovido(true);
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`p-4 rounded shadow cursor-pointer transition ${
        foiMovido ? 'bg-green-100' : 'bg-white'
      }`}
    >
      <h2 className="text-lg font-bold mb-1">{cliente.empresa}</h2>
      <p className="text-sm text-gray-600 mb-2">{cliente.segmento} • {cliente.porte}</p>

      <div className="space-y-1 text-sm text-gray-700">
        {cliente.contato && (
          <p><span className="font-semibold">👤 Contato:</span> {cliente.contato}</p>
        )}

        {cliente.telefone_comercial && (
          <p>
            <span className="font-semibold">📞 Tel: </span>
            <a
              href={formatarWhatsAppLink(cliente.telefone_comercial)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {cliente.telefone_comercial}
            </a>
          </p>
        )}

        {cliente.celular && (
          <p>
            <span className="font-semibold">📱 Cel: </span>
            <a
              href={formatarWhatsAppLink(cliente.celular)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {cliente.celular}
            </a>
          </p>
        )}

        {cliente.outros_telefones && (
          <p><span className="font-semibold">📟 Outros:</span> {cliente.outros_telefones}</p>
        )}

        {cliente.email && (
          <p>
            <span className="font-semibold">📧 E-mail: </span>
            <a
              href={`mailto:${cliente.email}`}
              className="text-blue-600 hover:underline"
            >
              {cliente.email}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

