import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateNodeId() {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
export function generateLinkId() {
  return `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
export function generateFlowId() {
  return `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Функция для массового присваивания health всем нодам в flows
export function ensureNodesHaveHealth(flows) {
  return flows.map((flow) => ({
    ...flow,
    nodes: flow.nodes.map((node) => ({
      ...node,
      health:
        typeof node.health === "number"
          ? node.health
          : Math.floor(Math.random() * 100),
    })),
  }));
}
// Функция для массива нод
export function ensureNodeListHasHealth(nodes) {
  return nodes.map((node) => ({
    ...node,
    health:
      typeof node.health === "number"
        ? node.health
        : Math.floor(Math.random() * 100),
  }));
}
