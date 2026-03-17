export interface NodeMetrics {
  rps: number;
  latency: number;
  cpu: number;
  memory: number;
  errorRate: number;
}

export interface SimulationState {
  isRunning: boolean;
  trafficLoad: number;
  chaosMode: {
    latency: number;
    packetLoss: number;
    failures: string[];
  };
}

export type ComponentType = 
  | 'api-gateway'
  | 'load-balancer'
  | 'microservice'
  | 'database'
  | 'cache'
  | 'queue'
  | 'worker'
  | 'cdn'
  | 'auth-service';

export interface SystemNodeData {
  label: string;
  type: ComponentType;
  instances: number;
  metrics?: NodeMetrics;
}
