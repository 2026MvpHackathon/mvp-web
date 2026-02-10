export interface ObjectItem {
  title: string;
  description: string;
  thumbnailUrl: string;
  materialId: number;
  sessionId: number;
  lastAccessAt: string;
}

export interface ObjectApiResponse {
  status: number;
  data: ObjectItem[];
}