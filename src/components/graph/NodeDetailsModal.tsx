import React from "react";
import ReactModal from "react-modal";
import { GraphNode as GraphNodeType } from "@/types/graph";

interface NodeDetailsModalProps {
  node: GraphNodeType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<GraphNodeType>) => void;
}

export const NodeDetailsModal: React.FC<NodeDetailsModalProps> = ({
  node,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [localNode, setLocalNode] = React.useState(node);
  React.useEffect(() => {
    setLocalNode(node);
  }, [node]);
  if (!node) return null;
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="bg-white rounded-lg p-6 max-w-lg mx-auto mt-24 shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Настройки узла</h2>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">ID</label>
        <div className="font-mono text-sm mb-2">{localNode.id}</div>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Тип</label>
        <div className="font-mono text-sm mb-2">{localNode.type}</div>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Название</label>
        <input
          className="border rounded px-2 py-1 w-full"
          value={localNode.name}
          onChange={(e) => setLocalNode({ ...localNode, name: e.target.value })}
        />
      </div>
      {/* Можно добавить другие поля по необходимости */}
      <div className="flex gap-2 mt-4">
        <button
          className="px-4 py-2 rounded bg-green-600 text-white font-bold"
          onClick={() => {
            onUpdate(localNode.id, localNode);
            onClose();
          }}
        >
          Сохранить
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-bold"
          onClick={onClose}
        >
          Отмена
        </button>
      </div>
    </ReactModal>
  );
};

export default NodeDetailsModal;
