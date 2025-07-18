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

export const GraphEditor: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNodeType[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]); // Новое состояние для связей
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null); // Для выделения связи
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null); // Для создания связи: первый выбранный узел
  const [zoom, setZoom] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  const generateNodeId = () =>
    `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Генерация уникального id для связи
  const generateLinkId = () =>
    `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

  const handleAddNode = useCallback(
    (type: "server" | "database" | "network" | "service") => {
      const newNode: GraphNodeType = {
        id: generateNodeId(),
        type,
        name: `Новый ${
          type === "server"
            ? "сервер"
            : type === "database"
            ? "БД"
            : type === "network"
            ? "сеть"
            : "сервис"
        }`,
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        health: Math.floor(Math.random() * 100),
        status:
          Math.random() > 0.7
            ? "warning"
            : Math.random() > 0.9
            ? "critical"
            : "healthy",
        properties: {},
      };

      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
      setHasChanges(true);
      toast.success(`${newNode.name} добавлен на граф`);
    },
    []
  );

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
    setNodes([]);
    setSelectedNodeId(null);
    setZoom(1);
    setHasChanges(false);
    toast.success("Граф очищен");
  };

  const handleClearAll = () => {
    if (nodes.length > 0) {
      setNodes([]);
      setSelectedNodeId(null);
      setHasChanges(true);
      toast.success("Все узлы удалены");
    }
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
            }}
          >
            {/* SVG слой для связей */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
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
                const source = nodes.find((n) => n.id === link.source);
                const target = nodes.find((n) => n.id === link.target);
                if (!source || !target) return null;
                return (
                  <GraphLinkLine
                    key={link.id}
                    source={{
                      x: source.x,
                      y: source.y,
                      width: 120,
                      height: 80,
                    }}
                    target={{
                      x: target.x,
                      y: target.y,
                      width: 120,
                      height: 80,
                    }}
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
          />
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
