import { User } from "@common/types/users.interface";
import axios from "axios";

export async function fetchUserByID(id: number) {
  const response = await axios.get<User>(`/users/${id}`);

  return response.data;
}
