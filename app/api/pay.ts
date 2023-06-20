import { PROTOCOL, ROOTURL } from "./login";

const url = `${PROTOCOL}://${ROOTURL}/api`;
export function APIzfbPay(phone: string, price: string) {
  return fetch(`${url}/ali-pay/pay`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ phone, num: price }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code == 200) {
        return data.resultData;
      } else {
        return Promise.reject(data);
      }
    });
}
