import React from "react";
import { GraphNode as GraphNodeType } from "@/types/graph";
import { InputPorts } from "./InputPorts";
import { OutputPorts } from "./OutputPorts";
// Nodes
import {
  InjectNode,
  DebugNode,
  FunctionNode,
  ChangeNode,
  SwitchNode,
  TemplateNode,
  MQTTNode,
  HTTPNode,
  FileNode,
  RBENode,
  SerialNode,
  JSONParserNode,
  SplitJoinNode,
  DelayNode,
  LinkNode,
  SystemServerNode,
  SystemDatabaseNode,
  SystemNetworkNode,
  SystemServiceNode,
  SystemApiNode,
  SystemStorageNode,
} from "./nodes";

interface GraphNodeProps {
  node: GraphNodeType;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDrag: (nodeId: string, x: number, y: number) => void;
  onDelete: (nodeId: string) => void;
  onPortConnectStart?: (
    nodeId: string,
    portIdx: number,
    type: "input" | "output"
  ) => void;
  onPortConnectEnd?: (
    nodeId: string,
    portIdx: number,
    type: "input" | "output"
  ) => void;
  dragPort?: { nodeId: string; portIdx: number } | null;
  links?: any[];
  nodes?: any[];
  onDoubleClick?: () => void;
}

export const GraphNode: React.FC<GraphNodeProps> = React.memo(
  ({
    node,
    isSelected,
    onSelect,
    onDrag,
    onDelete,
    onPortConnectStart,
    onPortConnectEnd,
    dragPort,
    links,
    nodes,
    onDoubleClick,
  }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
    const nodeRef = React.useRef<HTMLDivElement>(null);
    const dragPos = React.useRef<{ x: number; y: number }>({
      x: node.x,
      y: node.y,
    });

    // Сброс позиции при изменении node.x/y
    React.useEffect(() => {
      dragPos.current = { x: node.x, y: node.y };
      if (nodeRef.current && !isDragging) {
        nodeRef.current.style.left = node.x + "px";
        nodeRef.current.style.top = node.y + "px";
      }
    }, [node.x, node.y, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
      // Не начинаем drag, если клик по порту (input/output)
      const target = e.target as HTMLElement;
      if (target && target.dataset && target.dataset.port) return;
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      dragPos.current = { x: node.x, y: node.y };
      setIsDragging(true);
      onSelect(node.id);
    };

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        const canvas = document.getElementById("graph-canvas");
        if (!canvas) return;
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragOffset.x;
        const newY = e.clientY - canvasRect.top - dragOffset.y;
        dragPos.current = { x: Math.max(0, newX), y: Math.max(0, newY) };
        if (nodeRef.current) {
          nodeRef.current.style.left = dragPos.current.x + "px";
          nodeRef.current.style.top = dragPos.current.y + "px";
        }
      },
      [isDragging, dragOffset]
    );

    const handleMouseUp = React.useCallback(() => {
      if (isDragging && nodeRef.current) {
        // Получаем финальные координаты из style
        const left = parseInt(nodeRef.current.style.left, 10);
        const top = parseInt(nodeRef.current.style.top, 10);
        onDrag(node.id, left, top); // Только теперь обновляем глобальный state
      }
      setIsDragging(false);
    }, [isDragging, onDrag, node.id]);

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    React.useEffect(() => {
      if (isSelected && nodeRef.current) {
        nodeRef.current.focus();
      }
    }, [isSelected]);

    // Выбор компонента для отображения узла
    let NodeContent: React.ReactNode = null;
    switch (node.type) {
      case "inject":
        NodeContent = <InjectNode name={node.name} health={node.health} />;
        break;
      case "debug":
        NodeContent = <DebugNode name={node.name} health={node.health} />;
        break;
      case "function":
        NodeContent = <FunctionNode name={node.name} health={node.health} />;
        break;
      case "change":
        NodeContent = <ChangeNode name={node.name} health={node.health} />;
        break;
      case "switch":
        NodeContent = <SwitchNode name={node.name} health={node.health} />;
        break;
      case "template":
        NodeContent = <TemplateNode name={node.name} health={node.health} />;
        break;
      case "mqtt":
        NodeContent = <MQTTNode name={node.name} health={node.health} />;
        break;
      case "http":
        NodeContent = <HTTPNode name={node.name} health={node.health} />;
        break;
      case "file":
        NodeContent = <FileNode name={node.name} health={node.health} />;
        break;
      case "rbe":
        NodeContent = <RBENode name={node.name} health={node.health} />;
        break;
      case "serial":
        NodeContent = <SerialNode name={node.name} health={node.health} />;
        break;
      case "json":
        NodeContent = <JSONParserNode name={node.name} health={node.health} />;
        break;
      case "split":
        NodeContent = <SplitJoinNode name={node.name} health={node.health} />;
        break;
      case "delay":
        NodeContent = <DelayNode name={node.name} health={node.health} />;
        break;
      case "link":
        NodeContent = <LinkNode name={node.name} health={node.health} />;
        break;
      case "server":
        NodeContent = (
          <SystemServerNode name={node.name} health={node.health} />
        );
        break;
      case "database":
        NodeContent = (
          <SystemDatabaseNode name={node.name} health={node.health} />
        );
        break;
      case "network":
        NodeContent = (
          <SystemNetworkNode name={node.name} health={node.health} />
        );
        break;
      case "service":
        NodeContent = (
          <SystemServiceNode name={node.name} health={node.health} />
        );
        break;
      case "api":
        NodeContent = <SystemApiNode name={node.name} health={node.health} />;
        break;
      case "storage":
        NodeContent = (
          <SystemStorageNode name={node.name} health={node.health} />
        );
        break;
      default:
        NodeContent = null;
    }

    return (
      <div
        ref={nodeRef}
        data-node-id={node.id}
        className="absolute cursor-move select-none"
        style={{ left: node.x, top: node.y }}
        onMouseDown={handleMouseDown}
        title={node.name}
        onDoubleClick={onDoubleClick}
        tabIndex={0}
        onKeyDown={
          isSelected
            ? (e) => {
                if (e.key === "Backspace" || e.key === "Delete") {
                  e.preventDefault();
                  onDelete(node.id);
                }
              }
            : undefined
        }
      >
        <InputPorts
          nodeId={node.id}
          ports={node.input}
          onPortConnectStart={(nid, idx) =>
            onPortConnectEnd && onPortConnectEnd(nid, idx, "input")
          }
          dragPort={dragPort}
          links={links}
          nodes={nodes}
        />
        {NodeContent ? (
          <div className="flex flex-col items-center space-y-2">
            {NodeContent}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-bold text-black drop-shadow">
              {node.name}
            </span>
          </div>
        )}
        <OutputPorts
          nodeId={node.id}
          ports={node.output}
          onPortConnectStart={(nid, idx) =>
            onPortConnectStart && onPortConnectStart(nid, idx, "output")
          }
        />
      </div>
    );
  }
);
