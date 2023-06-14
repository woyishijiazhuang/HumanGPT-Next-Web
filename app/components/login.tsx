import * as React from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

import styles from "./login.module.scss";

import CloseIcon from "../icons/close.svg";
import Locale from "../locales";
import { IconButton } from "../components/button";
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
        onKeyUp={phoneKeyUp}
      />
      <div>
        <input
          id={styles["login-code"]}
          type="number"
          maxLength={6}
          placeholder={Locale.Home.CodePlaceholder}
          onKeyUp={codeKeyUp}
        />
        <IconButton
          text={Locale.Home.GetCode}
          onClick={() => alert("获取验证码")}
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

function phoneKeyUp() {
  console.log("input phone");
}

function codeKeyUp() {
  console.log("input code");
}
