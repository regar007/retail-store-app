import axios from "axios";
import localStorageUtils from "../utils/localStorage.utils";

export const setAuthHeaders = (options: any) => {
  let session = localStorageUtils.readSession();
  if (session && session.accessToken) {
    if (options.headers) {
      options.headers["authorization"] = "Bearer " + session.accessToken;
    } else {
      let cookieHeader = new Headers({
        authorization: "Bearer " + session.accessToken,
        "Content-Type": "application/json",
      });

      options.headers = cookieHeader;
    }
  }
  console.log('options ', options)
  return options
};

// export const handleApiCall = ({url, body, options}: any) => {
//     return axios.post(url, body, options).catch((reason) => {
//         console.log('reason ', reason)
//         const forbidden = reason.response.status === 403
//         console.log('forbidden ', forbidden)
//         if(forbidden){

//         }
//     })
// }
