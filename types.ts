export interface BoundingBox {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 scale
}

export interface AuditResponse {
  answer: string;
  items: BoundingBox[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AuditSession {
  id: string;
  imageUrl: string;
  imageFile: File;
  history: ChatMessage[];
  lastAnalysis?: AuditResponse;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  AUDIT = 'AUDIT',
  CHAT = 'CHAT',
}