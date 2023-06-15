import { useUserStore } from "../store/user";

const PROTOCOL = "http";
const ROOTURL = "8.219.92.9:18005";

export const APIgetCode = () => {
  const phone = useUserStore((state) => state.phone);
  console.log("APIgetCode:" + phone);
  fetch(`${PROTOCOL}://${ROOTURL}/sendmessage?phone=${phone}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "success") {
        alert("验证码已发送");
      }
    });
};

export const APIlogin = () => {
  const { phone, code } = useUserStore();
  console.log("APIlogin:" + phone + "," + code);
  fetch(`${PROTOCOL}://${ROOTURL}/login`, {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "success") {
        alert("登录成功，后续还要做一些状态变更,以及弹窗样式的修改");
      }
    });
};
