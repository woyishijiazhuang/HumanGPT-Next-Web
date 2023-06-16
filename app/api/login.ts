const PROTOCOL = "http";
const ROOTURL = "8.219.92.9:18005";

export const APIgetCode = (phone: string) => {
  console.log("APIgetCode:" + phone);
  fetch(`${PROTOCOL}://${ROOTURL}/sendmessage?phone=${phone}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "success") {
        alert("验证码已发送");
      }
    });
};

export const APIlogin = (phone: string, code: string) => {
  return fetch(`${PROTOCOL}://${ROOTURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, code }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "success") {
        alert("登录成功，后续还要做一些状态变更,以及弹窗样式的修改");
        return data.resultData.key;
      } else {
        alert("登录error");
      }
    });
};
