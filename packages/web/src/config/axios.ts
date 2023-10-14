// configure axios
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.interceptors.response.use((response) => {
  if (response.data && response.data.data) {
    response.data = response.data.data;
  }
  return response;
});
