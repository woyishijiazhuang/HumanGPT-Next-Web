import { createRoot } from "react-dom/client";
import styles from "./bubble.module.scss";
import SuccessIcon from "../icons/bubble-success.svg";
import ErrorIcon from "../icons/close.svg";
// 气泡函数
interface message {
  type?: "success" | "error" | "warning";
  msg: JSX.Element | string;
}
function Bubble(props: message) {
  const type = props.type || "success";
  return (
    <div className={styles["bubble"] + styles[type]}>
      {props.type == "success" && <SuccessIcon></SuccessIcon>}
      {props.type == "error" && <ErrorIcon></ErrorIcon>}
      <span>{props.msg}</span>
    </div>
  );
}
// 创建一个气泡
export function createBubble(props: message) {
  const div = document.createElement("div");
  div.className = "bubble-list";
  document.body.appendChild(div);

  const root = createRoot(div);
  setTimeout(() => {
    root.unmount();
    div.remove();
  }, 3000);

  root.render(<Bubble {...props}></Bubble>);
}
