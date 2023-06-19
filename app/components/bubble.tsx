import { createRoot } from "react-dom/client";
import styles from "./bubble.module.scss";
import SuccessIcon from "../icons/bubble-success.svg";
// 气泡函数
interface message {
  type?: "success" | "error" | "warning";
  msg: string;
}
function Bubble(props: message) {
  return (
    <div className={styles["bubble"]}>
      <SuccessIcon></SuccessIcon>
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
