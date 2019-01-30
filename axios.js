import axios from "axios";


// needed for csrf
var instance = axios.create({
  xsrfCookieName: "mytoken",
  xsrfHeaderName: "csrf-token"
});

export default instance;
