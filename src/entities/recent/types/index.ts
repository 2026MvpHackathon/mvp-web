export interface RecentItem {
  title: string;
  description: string;
  thumbnailUrl: string;
  materialId: number;
  sessionId: number;
  lastAccessAt: string;
}

export interface RecentApiResponse {
  status: number;
  message: string;
  data: RecentItem[];
}