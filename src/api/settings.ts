import { axiosClient } from "./axiosClient";

export interface ShopInfo {
  id: string;
  name: string;
  notificationEmail?: string;
  createdAt: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SettingsResponse {
  success: boolean;
  data: {
    shop: ShopInfo;
    user: UserInfo;
    teamMember: TeamMember[];
  };
}

/**
 * Récupérer les informations de la boutique, de l'utilisateur et de l'équipe
 */
export const fetchSettings = async () => {
  const response = await axiosClient.get<SettingsResponse>("/auth/settings");
  return response.data.data;
};

/**
 * Ajouter un nouveau membre à l'équipe
 */
export const addTeamMember = async (data: any) => {
  const response = await axiosClient.post("/auth/team", data);
  return response.data;
};

/**
 * Mettre à jour un membre existant (nom, mot de passe, rôle)
 */
export const updateTeamMember = async (id: string, data: any) => {
  const response = await axiosClient.put(`/auth/team/${id}`, data);
  return response.data;
};

/**
 * Retirer ou suspendre un membre de l'équipe
 * @param action "remove" | "disable"
 */
export const manageTeamMemberStatus = async (id: string, action: "remove" | "disable") => {
  const response = await axiosClient.post("/auth/team/action", { id, action });
  return response.data;
};
