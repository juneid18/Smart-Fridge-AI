import axios from "axios";

export default async function FetchUserData(email) {
  try {
    const response = await axios.post(
      "http://192.168.185.236:3000/user",{email});
    if (response) {
      console.log("response is appended");
    }
    return response.data;
  } catch (error) {
    console.log("Error Occupied While fetching User Details");
    console.log(error);
    return null;
  }
}
