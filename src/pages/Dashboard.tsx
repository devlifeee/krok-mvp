import React, { useState, useEffect } from 'react';
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
import { toast } from '@/components/ui/use-toast';

// Генератор случайных данных для метрик
const generateRandomMetrics = () => {
  const totalNodes = Math.floor(Math.random() * 50) + 10;
  const activeConnections = Math.floor(Math.random() * 300) + 50;
  const dataSources = Math.floor(Math.random() * 10) + 3;
  const avgLoad = Math.floor(Math.random() * 40) + 50;

  return {
    totalNodes,
    activeConnections,
    dataSources,
    avgLoad,
    nodeChange: Math.floor(Math.random() * 10) + 1,
    connectionChange: Math.floor(Math.random() * 20) + 1,
    loadChange: Math.floor(Math.random() * 10) + 1,
  };
};

// Генератор случайных алертов
const generateRandomAlerts = () => {
  const alertTypes = [
    { type: 'CPU', message: 'High CPU usage detected', severity: 'high' },
    { type: 'Memory', message: 'Memory threshold exceeded', severity: 'medium' },
    { type: 'Network', message: 'Network latency spike', severity: 'low' },
    { type: 'Disk', message: 'Low disk space', severity: 'high' },
    { type: 'Service', message: 'Service unavailable', severity: 'critical' },
  ];

  return [...Array(5)].map((_, i) => {
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    return {
      id: `alert-${i}-${Date.now()}`,
      type: randomAlert.type,
      message: randomAlert.message,
      severity: randomAlert.severity,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 3600 * 1000)),
    };
  });
};

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState(generateRandomMetrics());
  const [alerts, setAlerts] = useState(generateRandomAlerts());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics(generateRandomMetrics());
      setAlerts(generateRandomAlerts());
      setIsRefreshing(false);
      toast({
        title: "Данные обновлены",
        description: "Последние метрики загружены",
      });
    }, 1000);
  };

  // Автоматическое обновление данных каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Определяем статус системы на основе нагрузки
  const getSystemStatus = (load: number) => {
    if (load > 80) return 'critical';
    if (load > 60) return 'warning';
    return 'healthy';
  };

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
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
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
          value={metrics.totalNodes}
          change={{
            value: metrics.nodeChange,
            type: Math.random() > 0.5 ? 'increase' : 'decrease'
          }}
          status="healthy"
          icon={<Server className="h-4 w-4" />}
        />
        <MetricCard
          title="Активные соединения"
          value={metrics.activeConnections}
          change={{
            value: metrics.connectionChange,
            type: Math.random() > 0.5 ? 'increase' : 'decrease'
          }}
          status="healthy"
          icon={<Network className="h-4 w-4" />}
        />
        <MetricCard
          title="Источники данных"
          value={metrics.dataSources}
          status={metrics.dataSources > 8 ? 'warning' : 'healthy'}
          icon={<Database className="h-4 w-4" />}
        />
        <MetricCard
          title="Средняя нагрузка"
          value={`${metrics.avgLoad}%`}
          change={{
            value: metrics.loadChange,
            type: Math.random() > 0.5 ? 'increase' : 'decrease'
          }}
          status={getSystemStatus(metrics.avgLoad)}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health - spans 2 columns */}
        <div className="lg:col-span-2">
          <SystemHealth 
            cpuUsage={Math.floor(Math.random() * 100)}
            memoryUsage={Math.floor(Math.random() * 100)}
            networkIn={Math.floor(Math.random() * 500)}
            networkOut={Math.floor(Math.random() * 300)}
          />
        </div>

        {/* Recent Alerts */}
        <div>
          <RecentAlerts alerts={alerts} />
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