import * as React from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import styles from "./subscribe.module.scss";
import { showModal } from "./modal-box";
import TickIcon from "../icons/tick.svg";
// 后续在这里加国际化，替换文本内容
import Locale from "../locales";
// 微信和支付宝图片,支付api
// import wxImg from ""
// import zfbImg from ""

import { APIzfbPay } from "../api/pay";

function Subscribe(onClose?: () => void) {
  // 三个套餐的权益
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

  useEffect(() => {
    // 请求初始化支付图片,这里不是二维码，具体操作百度
    // APIzfbPay("13657139095", "1").then(data=>console.log(data))；
    // 请求微信二维码
  }, []);

  const [list, setList] = useState(listA);

  // 套餐选中状态，默认第一个套餐；1套餐13.9元, 2套餐39.9元, 3套餐99.9元
  const [tc, setTc] = useState(0);
  // 套餐对应价格
  const tcPrice = [13.9, 39.9, 99.9];
  // 支付方式。
  const [payPlant, setPay] = useState<"wx" | "zfb">("zfb");
  // 获取支付二维码
  function getPayImg() {
    alert(`请求支付二维码,套餐价格${tc},支付方式${payPlant}`);
  }
  return (
    <div className={styles["subscribe-container"]}>
      <p className={styles["top-title"]}>HumanChat聊天权限订阅</p>
      <div className={styles["package"]}>
        <div className={styles["tc"]}>
          <input
            type="radio"
            id="tc1"
            name="tc"
            value={0}
            checked={tc == 0}
            onChange={() => {
              setTc(0);
              setList(listA);
            }}
          />
          <label htmlFor="tc1">
            <Taocan name="A" price="13.9" title="HumanChat试用计划" />
          </label>
        </div>

        <div className={styles["tc"]}>
          <input
            type="radio"
            id="tc2"
            name="tc"
            value={1}
            checked={tc == 1}
            onChange={() => {
              setTc(1);
              setList(listB);
            }}
          />
          <label htmlFor="tc2">
            <Taocan name="B" price="39.9" title="HumanChat季度无限次"></Taocan>
          </label>
        </div>

        <div className={styles["tc"]}>
          <input
            type="radio"
            id="tc3"
            name="tc"
            value={2}
            checked={tc == 2}
            onChange={() => {
              setTc(2);
              setList(listC);
            }}
          />
          <label htmlFor="tc3">
            <Taocan name="C" price="99.9" title="HumanChat年度无限次"></Taocan>
          </label>
        </div>
      </div>
      <List list={list}></List>
      <div className={styles["pay"]}>
        <p>支付通道</p>
        <div>
          <div className={styles["code"]}>
            <img src="" alt="支付二维码" />
          </div>
          <div className={styles["payplant"]}>
            {/* a 换成 radio */}
            {/* <a
              href="javascript:void(0)"
              className={styles["zhifubao"]}
              onClick={() => setPay("zfb")}
            >
              <img alt="zfbImg"></img>
              支付宝支付
              <TickIcon></TickIcon>
            </a>
            <a
              href="javascript:void(0)"
              className={styles["weixin"]}
              onClick={() => setPay("wx")}
            >
              <img alt="wxImg"></img>
              微信支付
              <TickIcon></TickIcon>
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export const showSubscribe = () => showModal(Subscribe);

function Taocan(props: { name: string; price: string; title: string }) {
  return (
    <>
      <div className={styles["taocan-name"]}>{props.name + "套餐订阅"}</div>
      <div className={styles["taocan-price"]}>{"￥" + props.price}</div>
      <div className={styles["taocan-title"]}>{props.title}</div>
    </>
  );
}
// 后续div排版要优化成ul排版
function List2(props: { list: any[] }) {
  return (
    <ul className={styles["list"]}>
      {props.list.map((item, i) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function List(props: { list: any[] }) {
  return (
    <div className={styles["list"]}>
      {props.list.map((item) => (
        <div className={styles["list-item"]} key={item}>
          {item && <TickIcon></TickIcon>}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
