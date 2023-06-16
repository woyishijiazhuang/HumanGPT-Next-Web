import * as React from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import styles from "./subscribe.module.scss";

import CloseIcon from "../icons/close.svg";
import Locale from "../locales";
import TickIcon from "../icons/tick.svg";

import { useUserStore } from "../store/user";
import { APIgetCode, APIlogin } from "../api/login";

interface ModalProps {
  children?: JSX.Element | JSX.Element[];
  onClose?: () => void;
}

export function Subscribe(props: ModalProps) {
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
  const listA = [
    "1000次聊天次数",
    "100个聊天预设提示",
    "18个预处理器聊天模型",
    "迅捷的响应速度",
    "极高易用性",
    "",
  ];
  const listB = [
    "季度无限次使用",
    "100个聊天预设提示",
    "18个预处理器聊天模型",
    "迅捷的响应速度",
    "自定义聊天功能",
    "极高易用性",
  ];

  const listC = [
    "年度无限次使用",
    "100个聊天预设提示",
    "18个预处理器聊天模型",
    "迅捷的响应速度",
    "自定义聊天功能",
    "极高易用性",
  ];
  const [tc, setTc] = useState(1); //1套餐13.9元, 2套餐39.9元, 3套餐99.9元
  const [pay, setPay] = useState(1); //支付宝1,微信2
  function getPayImg() {
    alert(`请求支付二维码,套餐${tc},支付方式${pay}`);
  }
  return (
    <div className={styles["subscribe-container"]}>
      <div className={styles["close-btn"]} onClick={props.onClose}>
        <CloseIcon />
      </div>
      <p className={styles["top-title"]}>HumanChat聊天权限订阅</p>
      <div className={styles["package"]}>
        <a href="javascript:void(0);" className={styles["price"]}>
          <Taocan name="A" price="13.9" title="HumanChat试用计划"></Taocan>
          <List list={listA}></List>
        </a>
        <a href="javascript:void(0);" className={styles["price"]}>
          <Taocan name="B" price="39.9" title="HumanChat季度无限次"></Taocan>
          <List list={listB}></List>
        </a>
        <a href="javascript:void(0);" className={styles["price"]}>
          <Taocan name="C" price="99.9" title="HumanChat年度无限次"></Taocan>
          <List list={listC}></List>
        </a>
      </div>
      <div className={styles["pay"]}>
        <p>支付通道</p>
        <div>
          <div className={styles["code"]}></div>
          <div className={styles["payplant"]}>
            <a
              href="javascript:void(0)"
              className={styles["zhifubao"]}
              onClick={() => setPay(1)}
            >
              <img></img>
              支付宝支付
              <TickIcon></TickIcon>
            </a>
            <a
              href="javascript:void(0)"
              className={styles["weixin"]}
              onClick={() => setPay(2)}
            >
              <img></img>
              微信支付
              <TickIcon></TickIcon>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function showSubscribe() {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) {
      closeModal();
    }
  };

  root.render(<Subscribe onClose={closeModal}></Subscribe>);
}

function Taocan(props: { name: string; price: string; title: string }) {
  return (
    <>
      <div className={styles["taocan-name"]}>{props.name + "套餐订阅"}</div>
      <div className={styles["taocan-price"]}>{"￥" + props.price}</div>
      <div className={styles["taocan-title"]}>{props.title}</div>
    </>
  );
}

function List(props: { list: any[] }) {
  const i = (s: string | number) => (
    <div className={styles["list-item"]}>
      {s && <TickIcon></TickIcon>}
      <span>{s}</span>
    </div>
  );
  return (
    <div className={styles["list"]}>{props.list.map((item) => i(item))}</div>
  );
}
