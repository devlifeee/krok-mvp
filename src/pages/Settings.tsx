import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Save, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    toast.success("Сохраняем настройки...");

    setTimeout(() => {
      toast.success("Применяем изменения к системе");
    }, 1000);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Настройки успешно сохранены");
    }, 3000);
  };

  const handleUserAction = (action: string, userName: string) => {
    toast.success(`${action} пользователя ${userName}...`);

    setTimeout(() => {
      toast.success(`Действие выполнено для ${userName}`);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Настройки системы
          </h1>
          <p className="text-gray-600 mt-1">
            Управление пользователями и конфигурация системы
          </p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Управление пользователями
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Пользователи системы</span>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">admin@krokos.com</div>
                  <div className="text-sm text-gray-500">Администратор</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Admin</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUserAction("Редактируем", "admin@krokos.com")
                    }
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">editor@krokos.com</div>
                  <div className="text-sm text-gray-500">Редактор</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Editor</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUserAction("Редактируем", "editor@krokos.com")
                    }
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUserAction("Удаляем", "editor@krokos.com")
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">viewer@krokos.com</div>
                  <div className="text-sm text-gray-500">Наблюдатель</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Viewer</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUserAction("Редактируем", "viewer@krokos.com")
                    }
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleUserAction("Удаляем", "viewer@krokos.com")
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Настройки безопасности
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Время сессии (часы)</Label>
              <Input id="session-timeout" type="number" defaultValue="12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-policy">Минимальная длина пароля</Label>
              <Input id="password-policy" type="number" defaultValue="8" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                defaultValue="https://api.krokos.local"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-interval">
                Интервал резервного копирования (дни)
              </Label>
              <Input id="backup-interval" type="number" defaultValue="7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Конфигурация системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">
                Интервал обновления данных (сек)
              </Label>
              <Input id="refresh-interval" type="number" defaultValue="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-nodes">Максимальное количество узлов</Label>
              <Input id="max-nodes" type="number" defaultValue="1000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="log-level">Уровень логирования</Label>
              <Input id="log-level" defaultValue="INFO" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage-path">Путь к данным</Label>
              <Input id="storage-path" defaultValue="/var/lib/krokos-graph" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
