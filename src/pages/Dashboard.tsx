
import React from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Database, 
  Network, 
  Activity,
  Plus,
  RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Обзор состояния инфраструктуры KrokOS Graph
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Добавить узел
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Всего узлов"
          value={24}
          change={{ value: 12, type: 'increase' }}
          status="healthy"
          icon={<Server className="h-4 w-4" />}
        />
        <MetricCard
          title="Активные соединения"
          value={156}
          change={{ value: 8, type: 'increase' }}
          status="healthy"
          icon={<Network className="h-4 w-4" />}
        />
        <MetricCard
          title="Источники данных"
          value={8}
          status="warning"
          icon={<Database className="h-4 w-4" />}
        />
        <MetricCard
          title="Средняя нагрузка"
          value="73%"
          change={{ value: 5, type: 'decrease' }}
          status="warning"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health - spans 2 columns */}
        <div className="lg:col-span-2">
          <SystemHealth />
        </div>

        {/* Recent Alerts */}
        <div>
          <RecentAlerts />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Открыть редактор</div>
                <div className="text-sm text-gray-500 mt-1">
                  Создать или изменить граф инфраструктуры
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Импорт данных</div>
                <div className="text-sm text-gray-500 mt-1">
                  Загрузить топологию из Kubernetes
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Настроить алерты</div>
                <div className="text-sm text-gray-500 mt-1">
                  Управление уведомлениями и порогами
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
