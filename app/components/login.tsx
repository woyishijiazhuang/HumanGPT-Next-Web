import * as React from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

import styles from "./login.module.scss";

import CloseIcon from "../icons/close.svg";
import Locale from "../locales";
import { IconButton } from "../components/button";

import { useUserStore } from "../store/user";
import { APIgetCode, APIlogin } from "../api/login";
import { useAccessStore } from "../store";
interface ModalProps {
  children?: JSX.Element | JSX.Element[];
  onClose?: () => void;
}

export function LoginModal(props: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    phone,
    setPhone,
    code,
    setCode,
    token,
    setToken,
    loginButton,
    setLoginButton,
    chatnum,
    setChatnum,
    vipType,
    setVipType,
  } = useUserStore();

  function phoneKeyUp($event: React.KeyboardEvent<HTMLInputElement>) {
    // 手机号
    setPhone(($event.target as HTMLInputElement).value);
  }
  const accessStore = useAccessStore();
  function codeKeyUp($event: React.KeyboardEvent<HTMLInputElement>) {
    const code = ($event.target as HTMLInputElement).value;
    if (code.length == 6) {
      setCode(code);
      APIlogin(phone, code).then((resultData) => {
        // 存登录状态
        setToken("login");
        // 存apikey
        accessStore.updateToken(resultData.key);
        // 存聊天次数
        setChatnum(resultData.num);
        // 存vip等级
        setVipType(resultData.vipType);
      });
    }
  }

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-close-btn"]} onClick={props.onClose}>
        <CloseIcon />
      </div>
      <p>{Locale.Home.LoginModelTitle}</p>
      <input
        id={styles["login-tel"]}
        type="number"
        maxLength={11}
        placeholder={Locale.Home.PhonePlaceholder}
        onKeyUp={($event) => phoneKeyUp($event)}
      />
      <div>
        <input
          id={styles["login-code"]}
          type="number"
          maxLength={4}
          placeholder={Locale.Home.CodePlaceholder}
          onKeyUp={codeKeyUp}
        />
        <IconButton
          text={Locale.Home.GetCode}
          onClick={() => {
            if (phone.length != 11) {
              alert("手机号长度不符合");
              return;
            }
            if (loginButton) {
              APIgetCode(phone).then(() => {
                props.onClose!!();
                // 弹出消息提示
              });
              setLoginButton(false);
              setTimeout(() => {
                setLoginButton(true);
              }, 600000);
            } else {
              alert("验证码已发送，请等待或稍后重试,60s样式待做");
            }
          }}
        />
      </div>
    </div>
  );
}

export function showLogin(props: ModalProps) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    props.onClose?.();
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<LoginModal {...props} onClose={closeModal}></LoginModal>);
}
