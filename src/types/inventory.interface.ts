import type { StockBatch } from "./stock.interface";



export interface Movement {
  id: string;
  batchId?: string;
  type: "IN" | "OUT" | "LOSS";
  quantity: number;
  reason: string | null;
  dateLabel: string;
  timeLabel: string;
  Product?: { name: string; barcode: string; unit: string };
}

export interface InventoryState {
  items: StockBatch[];
  entrees: Movement[];
  sorties: Movement[];
  loading: boolean;
  error: string;
  loadStock: () => Promise<void>;
  loadMovements: (days: number) => Promise<void>;
  addLoss: (batchId: string, quantity: number, reason: string) => Promise<void>;
  updateBatch: (id: string, data: any) => Promise<void>;
}