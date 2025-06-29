
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut,
  Server,
  Database,
  Network,
  Settings
} from 'lucide-react';

export const GraphEditor: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Редактор графа</h1>
            <Badge variant="secondary">Не сохранено</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Импорт
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Tool Palette */}
        <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Инструменты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-16 flex-col">
                  <Server className="h-6 w-6 mb-1" />
                  <span className="text-xs">Сервер</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Database className="h-6 w-6 mb-1" />
                  <span className="text-xs">БД</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Network className="h-6 w-6 mb-1" />
                  <span className="text-xs">Сеть</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Settings className="h-6 w-6 mb-1" />
                  <span className="text-xs">Сервис</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Управление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ZoomIn className="h-4 w-4 mr-2" />
                Увеличить
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ZoomOut className="h-4 w-4 mr-2" />
                Уменьшить
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative bg-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <Server className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Начните создание графа</h3>
              <p className="text-sm">
                Перетащите компоненты из панели инструментов<br />
                или импортируйте существующую топологию
              </p>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 p-4 bg-gray-50 border-l border-gray-200">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Свойства</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Выберите узел для<br />
                  редактирования свойств
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
