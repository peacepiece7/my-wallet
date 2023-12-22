import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * @description 뒤로기가나 새로고침 등을 통해 페이지를 떠날 때, 사용자에게 확인을 받습니다.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
 */
function useLeaveBeforeSave(cb) {
  const handler = useCallback(
    (ev) => {
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
function useBeforeLeaveMouse(cb) {
  // 전역으로 선언하기엔 이름이 너무 흔합니다.
  const html = useMemo(() => {
    var _a;
    return typeof document !== "undefined"
      ? (_a = document.querySelector("html")) === null || _a === void 0
        ? void 0
        : _a.getBoundingClientRect()
      : null;
  }, []);
  if (!html) {
    throw new Error("only supported in browser, plz check your env");
  }
  const handler = useCallback(
    (ev) => {
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
 * @description 클릭 이벤트를 감지 후 콜백을 실행합니다.
 */
// prettier-ignore
const useClick = (onClick) => {
    const element = useRef(null);
    useEffect(() => {
        if (element.current)
            element.current.addEventListener('click', onClick);
        return () => {
            if (element.current)
                element.current.removeEventListener('click', onClick);
        };
    }, []);
    return element;
};

/**
 * @description 특정 요소를 서서히 나타나게 합니다.
 * @default
 * duration: 1000
 * delay: 100
 */
// prettier-ignore
function useFadeIn(duration = 1000, delay = 100) {
    const ref = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            if (ref.current) {
                ref.current.style.opacity = '1';
                ref.current.style.transition = `opacity ${duration}ms ease-in-out`;
            }
        }, delay);
    }, []);
    return {
        ref,
        style: { opacity: '0' },
    };
}

/**
 * @description 브라우저 전체화면을 사용할 수 있게 합니다.
 * 아직 브라우저 호환성을 고려하지 않았습니다.
 * 테스트 코드가 없습니다.
 */
function useFullscreen() {
  const ref = useRef(null);
  const [isFull, setIsFull] = useState(false);
  const triggerFull = useCallback(() => {
    if (ref.current) {
      ref.current.requestFullscreen();
      setIsFull(true);
      // TODO : 브러우저 호환성 고려하기
      // if (ref.current.webkitReqeustFullscreen) {
      // ref.current.webkitReqeustFullscreen()
      // }
      // if (ref.current.mozReqeustFullscreen) {
      // ref.current.mozReqeustFullscreen()
      // if(ref.current.msReqeustFullscreen) {
      // ref.current.msReqeustFullscreen()
    }
  }, []);
  const exitFull = useCallback(() => {
    document.exitFullscreen();
    setIsFull(false);
  }, []);
  return { ref, triggerFull, exitFull, isFull };
}

/**
 * @description 네트워크 상태를 감자합니다.
 */
function useNetwork(onChange) {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === "function") {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);
  return status;
}

/**
 * @description 스크롤 위치를 감지합니다.
 */
function useScroll() {
  const [state, setState] = useState({ x: 0, y: 0 });
  const onScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    setState({ x: window.scrollX, y: window.scrollY });
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}

/**
 * @description 컴포넌트가 언마운트 될 때 함수를 호출합니다.
 */
function useWillUnmount(callback) {
  useEffect(() => {
    return callback;
  }, []);
}

export {
  useBeforeLeaveMouse,
  useClick,
  useFadeIn,
  useFullscreen,
  useLeaveBeforeSave,
  useNetwork,
  useScroll,
  useWillUnmount,
};
