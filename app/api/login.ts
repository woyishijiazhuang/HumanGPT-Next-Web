import { headers } from "next/dist/client/components/headers";

const PROTOCOL = "http";
const ROOTURL = "8.219.92.9:18005";

export const APIgetCode = (phone: string) => {
  console.log("APIgetCode:" + phone);
  return fetch(`${PROTOCOL}://${ROOTURL}/sendmessage?phone=${phone}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "success") {
        alert("验证码已发送,做成消息提示");
      }
    });
};

export const APIlogin = (phone: string, code: string) => {
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
        alert(data.msg);
      }
    });
};
