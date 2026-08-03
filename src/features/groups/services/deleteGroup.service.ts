import { customFetch } from "@/services/customFetch";

export async function deleteGroup(id: number): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(`/groups/${id}`, {
    method: "DELETE",
  });
}
