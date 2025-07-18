import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Network, Settings } from "lucide-react";

interface NodePaletteProps {
  onAddNode: (
    type: "server" | "database" | "network" | "service" | "api" | "storage"
  ) => void;
}

const nodeTypes = [
  {
    type: "server" as const,
    icon: Server,
    label: "Сервер",
    color: "bg-blue-50 hover:bg-blue-100",
  },
  {
    type: "database" as const,
    icon: Database,
    label: "БД",
    color: "bg-green-50 hover:bg-green-100",
  },
  {
    type: "network" as const,
    icon: Network,
    label: "Сеть",
    color: "bg-purple-50 hover:bg-purple-100",
  },
  {
    type: "service" as const,
    icon: Settings,
    label: "Сервис",
    color: "bg-orange-50 hover:bg-orange-100",
  },
  {
    type: "api" as const,
    icon: Settings,
    label: "API",
    color: "bg-cyan-50 hover:bg-cyan-100",
  },
  {
    type: "storage" as const,
    icon: Database,
    label: "Хранилище",
    color: "bg-yellow-50 hover:bg-yellow-100",
  },
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  // dragstart handler
  const handleDragStart = (
    e: React.DragEvent,
    type: (typeof nodeTypes)[number]["type"]
  ) => {
    e.dataTransfer.setData("application/node-type", type);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Инструменты</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {nodeTypes.map(({ type, icon: Icon, label, color }) => (
            <div
              key={type}
              className={`h-16 flex flex-col items-center justify-center ${color} border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer select-none`}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              tabIndex={0}
              role="button"
              title={label}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
