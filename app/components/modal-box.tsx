import { useEffect } from "react";
import { createRoot } from "react-dom/client";

import styles from "./modal-box.module.scss";
import CloseIcon from "../icons/close.svg";

// 在任意地方导入showModal，将函数组件的名字传入（组件要有一个参数 onClose?: ()=> void ）,即可打开模态框，组件内调用onClose可关闭
interface ModalProps {
  ele: (onClose?: () => void) => JSX.Element;
  onClose: () => void;
}
function Modal(props: ModalProps) {
  // 生命周期
  // 组件渲染后监听 ESC 实现返回关闭模态框
  // 组件销毁时取消监听
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
    <div className={styles["modal-box"]}>
      {props.ele(props.onClose)}
      {/* { children({onClose:props.onClose}) } */}
      <div className={styles["modal-close-btn"]} onClick={props.onClose}>
        <CloseIcon />
      </div>
    </div>
  );
}

export function showModal(ele: (onClose?: () => void) => JSX.Element) {
  const div = document.createElement("div");
  div.className = "modal-mask";
  document.body.appendChild(div);

  const root = createRoot(div);
  const closeModal = () => {
    root.unmount();
    div.remove();
  };

  div.onclick = (e) => {
    if (e.target === div) closeModal();
  };

  root.render(<Modal ele={ele} onClose={closeModal}></Modal>);
}
