import axios from "axios";

export const axiosWithAuth = () => {
  return axios.create({
    headers: {
      headers: { "x-access-token": localStorage.getItem("token") },
    },
  });
};
