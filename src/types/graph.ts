export type NodeType =
  | "server"
  | "database"
  | "network"
  | "service"
  | "api"
  | "storage"
  | "inject"
  | "debug"
  | "function"
  | "change"
  | "switch"
  | "template"
  | "mqtt"
  | "http"
  | "file"
  | "rbe"
  | "serial"
  | "json"
  | "split"
  | "delay"
  | "link";

// Типы для различных свойств узлов
export interface NodeProperty {
  name: string;
  value: any;
  type:
    | "string"
    | "number"
    | "boolean"
    | "select"
    | "textarea"
    | "json"
    | "password";
  required?: boolean;
  description?: string;
  options?: { label: string; value: any }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

// Специфичные свойства для разных типов узлов
export interface InjectNodeProperties {
  payload: string;
  topic: string;
  repeat: number; // 0 = не повторять
  crontab: string;
  once: boolean;
  injectAtStart: boolean;
}

export interface HTTPNodeProperties {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  tls: boolean;
  proxy: string;
  timeout: number;
  headers: Record<string, string>;
  body: string;
  followRedirects: boolean;
  rejectUnauthorized: boolean;
}

export interface MQTTNodeProperties {
  topic: string;
  qos: 0 | 1 | 2;
  retain: boolean;
  payload: string;
  payloadType: "string" | "buffer" | "json";
  broker: string;
  username: string;
  password: string;
  clientId: string;
}

export interface FunctionNodeProperties {
  func: string; // JavaScript код
  outputCount: number;
  timeout: number;
  stopOnError: boolean;
}

export interface ChangeNodeProperties {
  rules: Array<{
    t: "set" | "change" | "delete" | "move";
    p: string;
    pt: "msg" | "flow" | "global";
    to: string;
    tot: "msg" | "flow" | "global";
    value: string;
  }>;
}

export interface SwitchNodeProperties {
  property: string;
  propertyType: "msg" | "flow" | "global";
  rules: Array<{
    t:
      | "=="
      | "!="
      | "<"
      | "<="
      | ">"
      | ">="
      | "null"
      | "nnull"
      | "true"
      | "false"
      | "else";
    v: string;
    vt: "str" | "num" | "bool" | "json" | "bin" | "re";
  }>;
  checkAll: boolean;
}

export interface TemplateNodeProperties {
  template: string;
  syntax: "mustache" | "jsonata";
  output: "str" | "bin" | "obj";
  format: "none" | "json" | "yaml" | "xml" | "html";
}

export interface FileNodeProperties {
  filename: string;
  filenameType: "str" | "jsonata";
  action: "read" | "write" | "delete" | "append";
  appendNewline: boolean;
  createDir: boolean;
  overwrite: boolean;
  encoding: "utf8" | "base64" | "hex";
}

export interface DebugNodeProperties {
  active: boolean;
  complete: boolean;
  console: boolean;
  tosidebar: boolean;
  toconsole: boolean;
  targetType: "msg" | "flow" | "global";
  statusVal: string;
  statusType: "auto" | "text";
}

export interface DelayNodeProperties {
  pauseType: "delay" | "rate" | "rateLimit";
  timeout: number;
  rate: number;
  rateUnits: "second" | "minute" | "hour";
  randomFirst: number;
  randomLast: number;
  randomUnits: "second" | "minute" | "hour";
  drop: boolean;
  maxDelay: number;
  maxDelayUnits: "second" | "minute" | "hour";
}

export interface JSONParserNodeProperties {
  property: string;
  propertyType: "msg" | "flow" | "global";
  action: "parse" | "stringify";
  pretty: boolean;
}

export interface SplitJoinNodeProperties {
  mode: "split" | "join";
  splitType: "length" | "count" | "regex" | "jsonata";
  splitLength: number;
  splitCount: number;
  splitRegex: string;
  splitJsonata: string;
  joinType: "count" | "timeout" | "manual";
  joinCount: number;
  joinTimeout: number;
  joinTimeoutUnits: "second" | "minute" | "hour";
}

export interface SerialNodeProperties {
  port: string;
  baudRate: number;
  dataBits: 7 | 8;
  stopBits: 1 | 2;
  parity: "none" | "even" | "odd";
  flowControl: "none" | "xon/xoff" | "rts/cts";
  newline: string;
  out: string;
  addchar: string;
  split: string;
  wait: number;
}

export interface RBENodeProperties {
  property: string;
  propertyType: "msg" | "flow" | "global";
  mode: "block" | "allow";
  rules: Array<{
    t:
      | "=="
      | "!="
      | "<"
      | "<="
      | ">"
      | ">="
      | "null"
      | "nnull"
      | "true"
      | "false"
      | "regex"
      | "else";
    v: string;
    vt: "str" | "num" | "bool" | "json" | "bin" | "re";
  }>;
}

export interface LinkNodeProperties {
  linkType: "in" | "out";
  target: string;
  targetType: "node" | "tab";
}

// Объединение всех свойств узлов
export type NodeProperties =
  | InjectNodeProperties
  | HTTPNodeProperties
  | MQTTNodeProperties
  | FunctionNodeProperties
  | ChangeNodeProperties
  | SwitchNodeProperties
  | TemplateNodeProperties
  | FileNodeProperties
  | DebugNodeProperties
  | DelayNodeProperties
  | JSONParserNodeProperties
  | SplitJoinNodeProperties
  | SerialNodeProperties
  | RBENodeProperties
  | LinkNodeProperties
  | Record<string, any>;

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  x: number;
  y: number;
  health: number; // 0-100
  status: "healthy" | "warning" | "critical" | "unknown";
  metrics?: {
    cpu?: number;
    memory?: number;
    network?: number;
    messages?: number;
    errors?: number;
  };
  properties: NodeProperties;
  input?: boolean | string[]; // true/false или список входов
  output?: boolean | string[]; // true/false или список выходов
  // Дополнительные поля из Node-RED
  enabled?: boolean;
  order?: number;
  wires?: string[][];
  credentials?: Record<string, any>;
  ui?: {
    label?: string;
    icon?: string;
    color?: string;
    paletteLabel?: string;
    group?: string;
    width?: number;
    height?: number;
    align?: "left" | "right" | "center";
  };
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: "network" | "dependency" | "data_flow";
  status: "active" | "inactive" | "error";
}

export interface Graph {
  id: string;
  name: string;
  nodes: GraphNode[];
  links: GraphLink[];
  createdAt: string;
  updatedAt: string;
}
