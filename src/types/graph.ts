
export interface GraphNode {
  id: string;
  type: 'server' | 'database' | 'network' | 'service';
  name: string;
  x: number;
  y: number;
  health: number; // 0-100
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  metrics?: {
    cpu?: number;
    memory?: number;
    network?: number;
  };
  properties: Record<string, any>;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: 'network' | 'dependency' | 'data_flow';
  status: 'active' | 'inactive' | 'error';
}

export interface Graph {
  id: string;
  name: string;
  nodes: GraphNode[];
  links: GraphLink[];
  createdAt: string;
  updatedAt: string;
}
