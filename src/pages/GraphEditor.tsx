
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { GraphNode as GraphNodeType } from '@/types/graph';
import { GraphNode } from '@/components/graph/GraphNode';
import { NodePalette } from '@/components/graph/NodePalette';
import { PropertiesPanel } from '@/components/graph/PropertiesPanel';
import { toast } from 'sonner';

export const GraphEditor: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNodeType[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  const selectedNode = nodes.find(node => node.id === selectedNodeId) || null;

  const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddNode = useCallback((type: 'server' | 'database' | 'network' | 'service') => {
    const newNode: GraphNodeType = {
      id: generateNodeId(),
      type,
      name: `Новый ${type === 'server' ? 'сервер' : type === 'database' ? 'БД' : type === 'network' ? 'сеть' : 'сервис'}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      health: Math.floor(Math.random() * 100),
      status: Math.random() > 0.7 ? 'warning' : Math.random() > 0.9 ? 'critical' : 'healthy',
      properties: {}
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setHasChanges(true);
    toast.success(`${newNode.name} добавлен на граф`);
  }, []);

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleDragNode = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
    setHasChanges(true);
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<GraphNodeType>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
    setHasChanges(true);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    setHasChanges(true);
    toast.success('Узел удален');
  }, [selectedNodeId]);

  const handleSave = () => {
    toast.success('Граф сохранен');
    setHasChanges(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'graph_export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Граф экспортирован');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
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
            toast.success('Граф импортирован');
          } catch (error) {
            toast.error('Ошибка импорта файла');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setNodes([]);
    setSelectedNodeId(null);
    setZoom(1);
    setHasChanges(false);
    toast.success('Граф очищен');
  };

  const handleClearAll = () => {
    if (nodes.length > 0) {
      setNodes([]);
      setSelectedNodeId(null);
      setHasChanges(true);
      toast.success('Все узлы удалены');
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
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" />
                Увеличить
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" />
                Уменьшить
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
              <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleClearAll}>
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
            className="absolute inset-0 bg-grid-pattern opacity-5"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`
            }}
          >
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Начните создание графа</h3>
                  <p className="text-sm">
                    Добавьте компоненты из панели инструментов<br />
                    или импортируйте существующую топологию
                  </p>
                </div>
              </div>
            ) : (
              nodes.map(node => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onSelect={handleSelectNode}
                  onDrag={handleDragNode}
                  onDelete={handleDeleteNode}
                />
              ))
            )}
          </div>
          
          {/* Canvas info overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm text-xs text-gray-600">
            Клик - выбор | Перетаскивание - перемещение | Двойной клик - удаление
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 p-4 bg-gray-50 border-l border-gray-200">
          <PropertiesPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
