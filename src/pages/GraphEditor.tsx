import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Settings,
} from "lucide-react";
import { GraphNode as GraphNodeType, GraphLink } from "@/types/graph";
import { GraphNode } from "@/components/graph/GraphNode";
import { NodePalette } from "@/components/graph/NodePalette";
import { PropertiesPanel } from "@/components/graph/PropertiesPanel";
import { GraphLinkLine } from "@/components/graph/GraphLinkLine";
import { toast } from "sonner";

// Новый тип для Flow
interface Flow {
  id: string;
  name: string;
  nodes: GraphNodeType[];
  links: GraphLink[];
}

// Для отслеживания позиции мыши при drag
function useMousePosition() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

export const GraphEditor: React.FC = () => {
  // flows: массив потоков
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: "flow_1",
      name: "Поток 1",
      nodes: [],
      links: [],
    },
  ]);
  const [activeFlowId, setActiveFlowId] = useState("flow_1");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  // Для хранения временного состояния drag from output port
  const [dragPort, setDragPort] = useState<{
    nodeId: string;
    portIdx: number;
  } | null>(null);

  // Начало drag с output порта
  const handlePortConnectStart = (
    nodeId: string,
    portIdx: number,
    type: "output" | "input"
  ) => {
    if (type === "output") {
      setDragPort({ nodeId, portIdx });
    }
  };
  // Drop на input порт
  const handlePortConnectEnd = (
    nodeId: string,
    portIdx: number,
    type: "output" | "input"
  ) => {
    if (type === "input" && dragPort) {
      // Создать связь между dragPort (output) и этим input
      const newLink: GraphLink = {
        id: generateLinkId(),
        source: dragPort.nodeId + ":" + dragPort.portIdx,
        target: nodeId + ":" + portIdx,
        type: "network",
        status: "active",
      };
      setLinks((prev) => [...prev, newLink]);
      setHasChanges(true);
      setDragPort(null);
      toast.success("Связь между портами создана");
    }
  };

  // Получить активный поток
  const activeFlow = flows.find((f) => f.id === activeFlowId)!;
  const nodes = activeFlow.nodes;
  const links = activeFlow.links;
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;
  const mousePos = useMousePosition();

  // Генерация id
  const generateNodeId = () =>
    `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateLinkId = () =>
    `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateFlowId = () =>
    `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // CRUD для flows
  const handleAddFlow = () => {
    const newFlow: Flow = {
      id: generateFlowId(),
      name: `Поток ${flows.length + 1}`,
      nodes: [],
      links: [],
    };
    setFlows((prev) => [...prev, newFlow]);
    setActiveFlowId(newFlow.id);
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };
  const handleSelectFlow = (flowId: string) => {
    setActiveFlowId(flowId);
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };
  const handleRenameFlow = (flowId: string, name: string) => {
    setFlows((prev) => prev.map((f) => (f.id === flowId ? { ...f, name } : f)));
  };
  const handleDeleteFlow = (flowId: string) => {
    if (flows.length === 1) return;
    setFlows((prev) => prev.filter((f) => f.id !== flowId));
    if (activeFlowId === flowId) {
      setActiveFlowId(flows.find((f) => f.id !== flowId)!.id);
    }
    setSelectedNodeId(null);
    setSelectedLinkId(null);
  };

  // Все функции для nodes/links теперь работают только с nodes/links активного потока
  const setNodes = (updater: (prev: GraphNodeType[]) => GraphNodeType[]) => {
    setFlows((prev) =>
      prev.map((f) =>
        f.id === activeFlowId ? { ...f, nodes: updater(f.nodes) } : f
      )
    );
  };
  const setLinks = (updater: (prev: GraphLink[]) => GraphLink[]) => {
    setFlows((prev) =>
      prev.map((f) =>
        f.id === activeFlowId ? { ...f, links: updater(f.links) } : f
      )
    );
  };

  // Функция для начала или завершения создания связи
  const handleLinkNode = useCallback(
    (nodeId: string) => {
      if (!linkSourceId) {
        setLinkSourceId(nodeId); // Первый клик — выбираем источник
        toast.info("Выберите второй узел для создания связи");
      } else if (linkSourceId && linkSourceId !== nodeId) {
        // Создаём связь между linkSourceId и nodeId
        const newLink: GraphLink = {
          id: generateLinkId(),
          source: linkSourceId,
          target: nodeId,
          type: "network", // по умолчанию
          status: "active",
        };
        setLinks((prev) => [...prev, newLink]);
        setLinkSourceId(null);
        setHasChanges(true);
        toast.success("Связь создана");
      } else {
        setLinkSourceId(null); // сброс, если клик по тому же узлу
      }
    },
    [linkSourceId]
  );

  // Обновляю типизацию для новых типов узлов
  type NodeType =
    | "server"
    | "database"
    | "network"
    | "service"
    | "api"
    | "storage";

  const handleAddNode = useCallback((type: NodeType) => {
    const newNode: GraphNodeType = {
      id: generateNodeId(),
      type,
      name: `Новый ${type}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      health: Math.floor(Math.random() * 100),
      status: "healthy",
      properties: {},
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setHasChanges(true);
    toast.success(`${newNode.name} добавлен на граф`);
  }, []);

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleDragNode = useCallback((nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, x, y } : node))
    );
    setHasChanges(true);
  }, []);

  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<GraphNodeType>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node
        )
      );
      setHasChanges(true);
    },
    []
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
      setHasChanges(true);
      toast.success("Узел удален");
    },
    [selectedNodeId]
  );

  const handleSave = () => {
    toast.success("Граф сохранен");
    setHasChanges(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "graph_export.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Граф экспортирован");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedNodes = JSON.parse(e.target?.result as string);
            setNodes(importedNodes);
            setSelectedNodeId(null);
            setHasChanges(true);
            toast.success("Граф импортирован");
          } catch (error) {
            toast.error("Ошибка импорта файла");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setNodes(() => []);
    setSelectedNodeId(null);
    setZoom(1);
    setHasChanges(false);
    toast.success("Граф очищен");
  };

  const handleClearAll = () => {
    if (nodes.length > 0) {
      setNodes(() => []);
      setSelectedNodeId(null);
      setHasChanges(true);
      toast.success("Все узлы удалены");
    }
  };

  // Drag&drop для добавления узла на canvas
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/node-type") as NodeType;
    if (!type) return;
    const canvas = document.getElementById("graph-canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleAddNodeAt(type, x, y);
  };
  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  // Добавить узел в конкретную позицию
  const handleAddNodeAt = (type: NodeType, x: number, y: number) => {
    const newNode: GraphNodeType = {
      id: generateNodeId(),
      type,
      name: `Новый ${type}`,
      x,
      y,
      health: Math.floor(Math.random() * 100),
      status: "healthy",
      properties: {},
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setHasChanges(true);
    toast.success(`${newNode.name} добавлен на граф`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Редактор графа</h1>
            <Badge variant={hasChanges ? "destructive" : "secondary"}>
              {hasChanges ? "Не сохранено" : "Сохранено"}
            </Badge>
            <span className="text-sm text-gray-500">
              Узлов: {nodes.length} | Масштаб: {Math.round(zoom * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Импорт
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* UI для flows (сверху) */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className={`flex items-center gap-1 px-3 py-1 rounded cursor-pointer ${
              activeFlowId === flow.id
                ? "bg-white border border-green-400 font-bold"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleSelectFlow(flow.id)}
          >
            <input
              className="bg-transparent font-bold w-20 outline-none"
              value={flow.name}
              onChange={(e) => handleRenameFlow(flow.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {flows.length > 1 && (
              <button
                className="text-red-400 ml-1"
                title="Удалить поток"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFlow(flow.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          className="ml-2 px-2 py-1 bg-green-200 rounded text-green-900 font-bold"
          onClick={handleAddFlow}
        >
          + Новый поток
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Tool Palette */}
        <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
          <NodePalette onAddNode={handleAddNode} />

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Управление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Увеличить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4 mr-2" />
                Уменьшить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Очистить все
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative bg-white overflow-hidden">
          <div
            id="graph-canvas"
            className="absolute inset-0 bg-grid-pattern"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              pointerEvents: "auto", // canvas принимает события
            }}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          >
            {/* SVG слой для связей */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 1, pointerEvents: "none" }} // SVG не перехватывает события
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                </marker>
              </defs>
              {links.map((link) => {
                const source = nodes.find(
                  (n) => n.id === link.source.split(":")[0]
                );
                const target = nodes.find(
                  (n) => n.id === link.target.split(":")[0]
                );
                if (!source || !target) return null;
                // Для портов: вычисляем смещение по индексу
                const sourceIdx = parseInt(
                  link.source.split(":")[1] || "0",
                  10
                );
                const targetIdx = parseInt(
                  link.target.split(":")[1] || "0",
                  10
                );
                const sourceY =
                  source.y +
                  40 +
                  (source.output && Array.isArray(source.output)
                    ? (sourceIdx - (source.output.length - 1) / 2) * 16
                    : 0);
                const targetY =
                  target.y +
                  40 +
                  (target.input && Array.isArray(target.input)
                    ? (targetIdx - (target.input.length - 1) / 2) * 16
                    : 0);
                return (
                  <GraphLinkLine
                    key={link.id}
                    source={{
                      x: source.x + 120,
                      y: sourceY,
                      width: 0,
                      height: 0,
                    }}
                    target={{ x: target.x, y: targetY, width: 0, height: 0 }}
                    color={
                      link.status === "active"
                        ? "#22c55e"
                        : link.status === "error"
                        ? "#ef4444"
                        : "#a3a3a3"
                    }
                    markerEnd={true}
                    opacity={0.8}
                  />
                );
              })}
              {/* Временная линия при drag */}
              {dragPort &&
                mousePos &&
                (() => {
                  const source = nodes.find((n) => n.id === dragPort.nodeId);
                  if (!source) return null;
                  const sourceIdx = dragPort.portIdx;
                  const sourceY =
                    source.y +
                    40 +
                    (source.output && Array.isArray(source.output)
                      ? (sourceIdx - (source.output.length - 1) / 2) * 16
                      : 0);
                  const startX = source.x + 120;
                  const startY = sourceY;
                  const canvas = document.getElementById("graph-canvas");
                  if (!canvas) return null;
                  const rect = canvas.getBoundingClientRect();
                  const endX = (mousePos.x - rect.left) / zoom;
                  const endY = (mousePos.y - rect.top) / zoom;
                  return (
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#22c55e"
                      strokeWidth={3}
                      opacity={0.7}
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })()}
            </svg>
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Начните создание графа
                  </h3>
                  <p className="text-sm">
                    Добавьте компоненты из панели инструментов
                    <br />
                    или импортируйте существующую топологию
                  </p>
                </div>
              </div>
            ) : (
              nodes.map((node) => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onSelect={(id) => {
                    setSelectedNodeId(id);
                    if (window.event && (window.event as MouseEvent).shiftKey) {
                      handleLinkNode(id); // Shift+клик — создать связь
                    }
                  }}
                  onDrag={handleDragNode}
                  onDelete={handleDeleteNode}
                  onPortConnectStart={handlePortConnectStart}
                  onPortConnectEnd={handlePortConnectEnd}
                />
              ))
            )}
          </div>

          {/* Canvas info overlay */}
          <div className="absolute bottom-4 left-4 bg-green-600 px-4 py-2 rounded-lg shadow text-xs text-white font-semibold border border-green-800">
            Клик - выбор | Перетаскивание - перемещение | Двойной клик -
            удаление | Shift+клик по двум узлам - создать связь
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 p-4 bg-gray-50 border-l border-gray-200">
          <PropertiesPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            links={links}
            onSelectLink={setSelectedLinkId}
            selectedLinkId={selectedLinkId}
            flow={activeFlow}
            isNodeSelected={!!selectedNode}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
