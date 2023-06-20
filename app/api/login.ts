export const PROTOCOL = "http";
export const ROOTURL = "8.219.92.9:18005";

export const APIgetCode = (phone: string) => {
  console.info("APIgetCode:" + phone);
  return fetch(`${PROTOCOL}://${ROOTURL}/sendmessage?phone=${phone}`);
};

export const APIlogin = (phone: string, code: string) => {
  console.info("APIlogin:" + JSON.stringify({ phone, code }));
  return fetch(`${PROTOCOL}://${ROOTURL}/login`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ phone, code }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.msg == "success") {
        return data.resultData;
      } else {
        return Promise.reject(data.msg);
      }
    });
};
