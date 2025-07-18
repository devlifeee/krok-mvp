import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraphNode, GraphLink } from "@/types/graph";
import { Settings, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface PropertiesPanelProps {
  selectedNode: GraphNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  links: GraphLink[];
  onSelectLink: (linkId: string) => void;
  selectedLinkId: string | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  links,
  onSelectLink,
  selectedLinkId,
}) => {
  const [localNode, setLocalNode] = React.useState<GraphNode | null>(null);

  React.useEffect(() => {
    setLocalNode(selectedNode);
  }, [selectedNode]);

  const handleSave = () => {
    if (localNode) {
      onUpdateNode(localNode.id, localNode);
      toast.success("Свойства узла сохранены");
    }
  };

  const handleDelete = () => {
    if (localNode) {
      onDeleteNode(localNode.id);
      toast.success("Узел удален");
    }
  };

  const updateLocalNode = (updates: Partial<GraphNode>) => {
    if (localNode) {
      setLocalNode({ ...localNode, ...updates });
    }
  };

  if (!localNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Свойства</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Выберите узел для
              <br />
              редактирования свойств
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Найти все связи, где этот узел — source или target
  const relatedLinks = links.filter(
    (l) => l.source === localNode.id || l.target === localNode.id
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Свойства узла</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="node-name">Название</Label>
          <Input
            id="node-name"
            value={localNode.name}
            onChange={(e) => updateLocalNode({ name: e.target.value })}
            placeholder="Введите название"
          />
        </div>

        <div className="space-y-2">
          <Label>Тип</Label>
          <Select
            value={localNode.type}
            onValueChange={(value) => updateLocalNode({ type: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="server">Сервер</SelectItem>
              <SelectItem value="database">База данных</SelectItem>
              <SelectItem value="network">Сеть</SelectItem>
              <SelectItem value="service">Сервис</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Статус</Label>
          <Select
            value={localNode.status}
            onValueChange={(value) => updateLocalNode({ status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthy">Здоровый</SelectItem>
              <SelectItem value="warning">Предупреждение</SelectItem>
              <SelectItem value="critical">Критический</SelectItem>
              <SelectItem value="unknown">Неизвестно</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-health">Здоровье (%)</Label>
          <Input
            id="node-health"
            type="number"
            min="0"
            max="100"
            value={localNode.health}
            onChange={(e) =>
              updateLocalNode({ health: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button onClick={handleSave} size="sm" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Сохранить
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600 space-y-1">
            <div>ID: {localNode.id}</div>
            <div>
              Позиция: {Math.round(localNode.x)}, {Math.round(localNode.y)}
            </div>
          </div>
        </div>
        {/* Список связей */}
        {relatedLinks.length > 0 && (
          <div className="pt-4 border-t">
            <div className="font-semibold text-sm mb-2">Связи этого узла:</div>
            <ul className="space-y-1">
              {relatedLinks.map((link) => (
                <li key={link.id}>
                  <button
                    className={`text-xs px-2 py-1 rounded transition border ${
                      selectedLinkId === link.id
                        ? "bg-orange-100 border-orange-400 font-bold"
                        : "bg-gray-100 border-gray-300"
                    } hover:bg-orange-50`}
                    onClick={() => onSelectLink(link.id)}
                  >
                    {link.source === localNode.id ? "→" : "←"} {link.source} -{" "}
                    {link.target} [{link.type}] ({link.status})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
