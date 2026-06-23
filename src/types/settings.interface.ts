import type { ShopInfo } from "../api/settings";
import type { TeamMember, UserInfo } from "../api/settings";


export interface SettingsState {
  shop: ShopInfo | null;
  user: UserInfo | null;
  team: TeamMember[];
  loading: boolean;
  error: string;
  loadSettings: () => Promise<void>;
  addMember: (data: any) => Promise<void>;
  updateMember: (id: string, data: any) => Promise<void>;
  manageMemberStatus: (id: string, action: "remove" | "disable") => Promise<void>;
}