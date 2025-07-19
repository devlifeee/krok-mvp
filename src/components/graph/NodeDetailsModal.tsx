import React from "react";
import { X } from "lucide-react";
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

  return (
    <div
      className={`absolute top-0 right-[20rem] h-full w-[28rem] bg-white transition-all duration-300 ease-in-out border-l border-gray-200 flex flex-col overflow-hidden z-[50] ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{ maxWidth: "100vw" }}
    >
      {isOpen && (
        <>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Настройки узла</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">ID</label>
              <div className="font-mono text-sm mb-2">{localNode.id}</div>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">Тип</label>
              <div className="font-mono text-sm mb-2">{localNode.type}</div>
            </div>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">
                Название
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={localNode.name}
                onChange={(e) =>
                  setLocalNode({ ...localNode, name: e.target.value })
                }
              />
            </div>
            {/* Можно добавить другие поля по необходимости */}
          </div>
          <div className="flex gap-2 p-4 border-t bg-gray-50">
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
        </>
      )}
    </div>
  );
};
