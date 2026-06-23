import type { AddStockPayload } from "./stock.interface";

export interface ScannerState {
  loading: boolean;
  error: string | null;
  addStock: (payload: AddStockPayload) => Promise<string>; // Retourne un message de succès
  sellProduct: (barcode: string, quantity: number) => Promise<{ message: string, lowStock: boolean }>;
}