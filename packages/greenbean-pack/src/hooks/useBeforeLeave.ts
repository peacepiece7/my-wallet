import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type BeforeLeaveEvent = WindowEventHandlersEventMap["beforeunload"];
/**
 * @description 뒤로기가나 새로고침 등을 통해 페이지를 떠날 때, 사용자에게 확인을 받습니다.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
 */
export function useLeaveBeforeSave(cb: () => boolean) {
  const handler = useCallback(
    (ev: BeforeLeaveEvent) => {
      if (cb()) ev.preventDefault();
    },
    [cb],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
}

/**
 * @description 마우스가 브라우저를 벗어날 때, 콜백을 실행합니다.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event
 */
export function useBeforeLeaveMouse(cb: () => void) {
  // 전역으로 선언하기엔 이름이 너무 흔합니다.
  const html = useMemo(() => {
    return typeof document !== "undefined"
      ? (document.querySelector("html") as HTMLElement)?.getBoundingClientRect()
      : null;
  }, []);
  if (!html) {
    throw new Error("only supported in browser, plz check your env");
  }

  const handler = useCallback(
    (ev: MouseEvent) => {
      if (
        ev.clientY <= 0 ||
        ev.clientY >= html.bottom ||
        ev.clientX <= 0 ||
        ev.clientX >= html.right
      )
        cb();
    },
    [cb],
  );

  useEffect(() => {
    window.addEventListener("mouseout", handler);
    return () => window.removeEventListener("mouseout", handler);
  }, []);
}

/**
 * @description 마우스가 특정 요소를 벗어나거나 들어오는 것을 감지합니다.
 */
export function useBeforeLeaveOrEnterMouse<T extends HTMLElement>() {
  const [isEnter, setIsEnter] = useState(false);
  const ref = useRef<T>(null);

  const handleMouseLeave = useCallback(() => {
    setIsEnter(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsEnter(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.addEventListener("mouseenter", handleMouseEnter);
    ref.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener("mouseenter", handleMouseEnter);
      ref.current.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseLeave]);

  return { ref, isEnter };
}
