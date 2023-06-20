import * as React from "react";
import styles from "./login.module.scss";

import Locale from "../locales";
import { IconButton } from "../components/button";

import { useUserStore } from "../store/user";
import { useAccessStore, useChatStore } from "../store";

import { showModal } from "./modal-box";
import { APIgetCode, APIlogin } from "../api/login";

function Login(onClose?: () => void) {
  const accessStore = useAccessStore();

  // 是否显示 Loding 字样, 登陆时打开
  const [isLoading, setIsLoading] = React.useState(false);

  // 手机号，验证码，登录token，聊天次数，vip等级
  const userStore = useUserStore() as any;

  // 输入手机号时存储到store
  function phoneKeyUp($event: React.KeyboardEvent<HTMLInputElement>) {
    userStore.setPhone(($event.target as HTMLInputElement).value);
  }

  // 检测手机号格式
  function testPhone() {
    const reg =
      /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    return reg.test(userStore.phone);
  }

  // 失去焦点时，判断phone格式，改变样式
  const [telStyle, setTelStyle] = React.useState(styles["login-tel"]);
  function phoneBlur() {
    if (userStore.phone.length == 0) {
      setTelStyle(styles["tel-default"]);
      return;
    }
    testPhone()
      ? setTelStyle(styles["tel-success"])
      : setTelStyle(styles["tel-error"]);
  }

  const [codeTime, setCodeTime] = React.useState(0);
  // 点击验证码,测试手机号格式
  function codeHandle() {
    if (!testPhone()) {
      alert("请输入正确的手机号");
      return;
    }
    // 1. 设置样式 60s
    setCodeTime(60);
    let num = 60;
    const js = setInterval(() => {
      if (num == 0) clearInterval(js);
      setCodeTime(num--);
    }, 1000);

    // 获取验证码
    APIgetCode(userStore.phone)
      .then((data) => alert("验证码发送成功"))
      .catch((data) => alert("验证码发送失败"));
  }

  // 输入验证码事件
  function codeKeyUp($event: React.KeyboardEvent<HTMLInputElement>) {
    const code = ($event.target as HTMLInputElement).value;
    if (code.length == 6 && testPhone()) {
      userStore.setCode(code);
      setIsLoading(true);
      APIlogin(userStore.phone, code)
        .then((resultData) => {
          // 存登录状态
          userStore.setToken("login");
          // 存apikey
          accessStore.updateToken(resultData.key);
          // 存聊天次数
          userStore.setChatnum(resultData.num);
          // 存vip等级
          userStore.setVipType(resultData.vipType);
          // 关闭登录框
          onClose?.();
        })
        .catch((data) => {
          alert("登陆失败");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  return (
    <div className={styles["login-container"]}>
      {/* 登录提示文本 */}
      <p>{Locale.Home.LoginModelTitle}</p>

      {/* phone输入框 */}
      <input
        className={telStyle}
        type="number"
        placeholder={Locale.Home.PhonePlaceholder}
        onKeyUp={($event) => phoneKeyUp($event)}
        onBlur={phoneBlur}
        autoComplete="on"
      />
      <div className={styles["login-code-button"]}>
        {/* 验证码输入框 */}
        <input
          className={styles["login-code"]}
          type="number"
          placeholder={Locale.Home.CodePlaceholder}
          // onKeyUp={ codeKeyUp }
          onKeyUp={codeKeyUp}
        />
        {/* 获取验证码的按钮 */}
        {codeTime == 0 ? (
          <IconButton text={Locale.Home.GetCode} onClick={codeHandle} />
        ) : (
          <IconButton text={codeTime + "S"} disabled />
        )}
      </div>

      {isLoading && (
        <div className={styles["loading"]}>
          Loading<span>...</span>
        </div>
      )}
    </div>
  );
}

export const showLogin = () => showModal(Login);

// interface ModalProps {
//   children?: JSX.Element | JSX.Element[];
//   onClose?: () => void;
// }

// export function LoginModal(props: ModalProps) {
//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         props.onClose?.();
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);

//     return () => {
//       window.removeEventListener("keydown", onKeyDown);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const {
//     phone,
//     setPhone,
//     code,
//     setCode,
//     token,
//     setToken,
//     loginButton,
//     setLoginButton,
//     chatnum,
//     setChatnum,
//     vipType,
//     setVipType,
//   } = useUserStore();

//   function phoneKeyUp($event: React.KeyboardEvent<HTMLInputElement>) {
//     // 手机号
//     setPhone(($event.target as HTMLInputElement).value);
//   }
//   const accessStore = useAccessStore();
//   function codeKeyUp($event: React.KeyboardEvent<HTMLInputElement>) {
//     const code = ($event.target as HTMLInputElement).value;
//     if (code.length == 6) {
//       setCode(code);
//       APIlogin(phone, code).then((resultData) => {
//         // 存登录状态
//         setToken("login");
//         // 存apikey
//         accessStore.updateToken(resultData.key);
//         // 存聊天次数
//         setChatnum(resultData.num);
//         // 存vip等级
//         setVipType(resultData.vipType);
//         // 关闭登录框
//         props.onClose?.();
//       });
//     }
//   }

//   return (
//     <div className={styles["login-container"]}>
//       <div className={styles["login-close-btn"]} onClick={props.onClose}>
//         <CloseIcon />
//       </div>
//       <p>{Locale.Home.LoginModelTitle}</p>
//       <input
//         id={styles["login-tel"]}
//         type="number"
//         maxLength={11}
//         placeholder={Locale.Home.PhonePlaceholder}
//         onKeyUp={($event) => phoneKeyUp($event)}
//       />
//       <div>
//         <input
//           id={styles["login-code"]}
//           type="number"
//           maxLength={4}
//           placeholder={Locale.Home.CodePlaceholder}
//           onKeyUp={codeKeyUp}
//         />
//         <IconButton
//           text={Locale.Home.GetCode}
//           onClick={() => {
//             if (phone.length != 11) {
//               alert("手机号长度不符合");
//               return;
//             }
//             if (loginButton) {
//               APIgetCode(phone);
//               setLoginButton(false);
//               setTimeout(() => {
//                 setLoginButton(true);
//               }, 600000);
//             } else {
//               alert("验证码已发送，请等待或稍后重试,60s样式待做");
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export function showLogin(props: ModalProps) {
//   const div = document.createElement("div");
//   div.className = "modal-mask";
//   document.body.appendChild(div);

//   const root = createRoot(div);
//   const closeModal = () => {
//     props.onClose?.();
//     root.unmount();
//     div.remove();
//   };

//   div.onclick = (e) => {
//     if (e.target === div) {
//       closeModal();
//     }
//   };

//   root.render(<LoginModal {...props} onClose={closeModal}></LoginModal>);
// }
