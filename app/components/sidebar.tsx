import { useEffect, useRef } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import UserIcon from "../icons/user.svg";
import MoneyIcon from "../icons/money.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import TwrapIcon from "../icons/twrap.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showToast } from "./ui-lib";
import { showLogin } from "./login";
import LogoIcon from "../icons/logo.svg";
import { showSubscribe } from "./subscribe";
import { useUserStore } from "../store/user";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useHotKey() {
  const chatStore = useChatStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        const n = chatStore.sessions.length;
        const limit = (x: number) => (x + n) % n;
        const i = chatStore.currentSessionIndex;
        if (e.key === "ArrowUp") {
          chatStore.selectSession(limit(i - 1));
        } else if (e.key === "ArrowDown") {
          chatStore.selectSession(limit(i + 1));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
}

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();
  const userStore = useUserStore();
  useHotKey();

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>HumanChat</div>
        <div className={styles["sidebar-sub-title"]}>
          Customize Your AI Conversation Assistant.
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <LogoIcon />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<TwrapIcon />}
          text={shouldNarrow ? undefined : Locale.Mask.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.NewChat, { state: { fromHome: true } })}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-action-close"] + " " + styles.mobile}>
          <IconButton
            icon={<CloseIcon />}
            onClick={() => {
              if (confirm(Locale.Home.DeleteChat)) {
                chatStore.deleteSession(chatStore.currentSessionIndex);
              }
            }}
          />
        </div>
        {/* <div className={styles["sidebar-action"]}>
          <Link to={Path.Settings}>
            <IconButton icon={<UserIcon />} shadow />
          </Link>
        </div> */}
        <div className={styles["sidebar-actions"]}>
          <div>
            <div className={styles["sidebar-action"]}>
              {userStore.token == "" ? (
                <IconButton
                  icon={<UserIcon />}
                  text={shouldNarrow ? undefined : Locale.Home.UserLogin}
                  onClick={() => {
                    // alert("弹出登录框");
                    // showLogin({});
                    showLogin();
                  }}
                  shadow
                />
              ) : (
                <IconButton
                  icon={<UserIcon />}
                  text={shouldNarrow ? undefined : Locale.Home.UserLoginOut}
                  onClick={() => {
                    // 删除登录信息
                    userStore.setToken("");
                    userStore.setPhone("");
                    userStore.setCode("");
                    userStore.setChatnum(0);
                    userStore.setVipType("");
                  }}
                  shadow
                />
              )}
            </div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                text={
                  (shouldNarrow ? "" : Locale.Home.Residue) + userStore.chatnum
                }
                onClick={() => {
                  // alert("这里要与后端交互写对话剩余次数");
                }}
                shadow
              />
            </div>
          </div>
          <div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<MoneyIcon />}
                text={shouldNarrow ? undefined : Locale.Home.Plan}
                onClick={() => {
                  showSubscribe();
                }}
                shadow
              />
            </div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<AddIcon />}
                text={shouldNarrow ? undefined : Locale.Home.NewChat}
                onClick={() => {
                  if (config.dontShowMaskSplashScreen) {
                    chatStore.newSession();
                    navigate(Path.Chat);
                  } else {
                    navigate(Path.NewChat);
                  }
                }}
                shadow
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
    </div>
  );
}
