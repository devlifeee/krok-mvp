
import React from 'react';
import { Server, Database, Network, Settings } from 'lucide-react';
import { GraphNode as GraphNodeType } from '@/types/graph';

interface GraphNodeProps {
  node: GraphNodeType;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDrag: (nodeId: string, x: number, y: number) => void;
  onDelete: (nodeId: string) => void;
}

const nodeIcons = {
  server: Server,
  database: Database,
  network: Network,
  service: Settings,
};

const nodeColors = {
  server: 'bg-blue-100 border-blue-300',
  database: 'bg-green-100 border-green-300',
  network: 'bg-purple-100 border-purple-300',
  service: 'bg-orange-100 border-orange-300',
};

const statusColors = {
  healthy: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  unknown: 'bg-gray-400',
};

export const GraphNode: React.FC<GraphNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onDrag,
  onDelete,
}) => {
  const IconComponent = nodeIcons[node.type];
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    onSelect(node.id);
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const canvas = document.getElementById('graph-canvas');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;
    
    onDrag(node.id, Math.max(0, newX), Math.max(0, newY));
  }, [isDragging, dragOffset, node.id, onDrag]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDoubleClick = () => {
    onDelete(node.id);
  };

  return (
    <div
      className={`absolute cursor-move select-none transition-all duration-200 ${
        isSelected ? 'ring-2 ring-green-500' : ''
      }`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title={`${node.name} - Двойной клик для удаления`}
    >
      <div className={`relative p-3 rounded-lg border-2 min-w-[120px] ${nodeColors[node.type]} ${
        isDragging ? 'opacity-80 shadow-lg scale-105' : 'shadow-md'
      }`}>
        {/* Status indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${statusColors[node.status]}`} />
        
        {/* Icon and name */}
        <div className="flex flex-col items-center space-y-2">
          <IconComponent className="h-8 w-8 text-gray-700" />
          <span className="text-sm font-medium text-gray-800">{node.name}</span>
        </div>
        
        {/* Health bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              node.health > 80 ? 'bg-green-500' : 
              node.health > 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${node.health}%` }}
          />
        </div>
        <div className="text-xs text-gray-600 mt-1 text-center">
          {node.health}% здоровье
        </div>
      </div>
    </div>
  );
};
