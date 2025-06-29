
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  component: string;
  timestamp: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'error',
    message: 'Высокая загрузка CPU (>90%)',
    component: 'Web Server 01',
    timestamp: '2 мин назад'
  },
  {
    id: '2',
    type: 'warning',
    message: 'Превышен порог использования памяти',
    component: 'Database Cluster',
    timestamp: '5 мин назад'
  },
  {
    id: '3',
    type: 'info',
    message: 'Успешное подключение к источнику данных',
    component: 'Prometheus',
    timestamp: '10 мин назад'
  },
  {
    id: '4',
    type: 'warning',
    message: 'Медленный отклик API',
    component: 'API Gateway',
    timestamp: '15 мин назад'
  }
];

const alertIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const alertColors = {
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200'
};

export const RecentAlerts: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние уведомления</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAlerts.map((alert) => {
            const Icon = alertIcons[alert.type];
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${alertColors[alert.type]}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        {alert.component}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
