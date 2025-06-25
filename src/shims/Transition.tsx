import {
  Div,
  isNilOrEmpty,
  mergeProps,
  type DivProps
} from "@hopper-ui/components";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

import "./Transition.css";

export interface TransitionProps extends DivProps {
  /**
     * 	Whether the transition should run on initial mount.
     */
  animateFirstRender?: boolean;
  /**
     * CSS classes to add to the transitioning element during the enter phase.
     */
  enter?: string;
  /**
     * CSS classes to add to the transitioning element during the leave phase.
     */
  leave?: string;
  /**
     * A controlled show value that determined whether or not the component is displayed.
     */
  show: boolean;
}

/**
 * A transition component allow enter/leave CSS transitions for React elements.
 *
 * [Documentation](https://wl-orbiter-website.netlify.app/?path=/docs/transition--page)
*/
export const Transition = forwardRef<HTMLDivElement, TransitionProps >(({
  animateFirstRender = false,
  children,
  enter,
  leave,
  show,
  ...rest
}, ref) => {
  const [isVisible, setIsVisible] = useState(show);

  const isInitialRender = useCommittedRef(useIsInitialRender());

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else if (isNilOrEmpty(leave)) {
      setIsVisible(false);
    }
  }, [show, leave]);

  const handleAnimationEnd = useCallback(() => {
    setIsVisible(show);
  }, [show]);

  const className = useMemo(() => {
    return show
      ? isInitialRender.current
        ? animateFirstRender ? enter : undefined
        : enter
      : leave;
  }, [isInitialRender, animateFirstRender, enter, leave, show]);

  if (!isVisible) {
    return null;
  }

  return (
    <Div
      {...mergeProps(
        rest,
        {
          className,
          onAnimationEnd: handleAnimationEnd,
          ref: ref
        }
      )}
    >
      {children}
    </Div>
  );
});

// Copied from https://github.com/react-restart/hooks/blob/master/src/useCommittedRef.ts.
function useCommittedRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

function useIsInitialRender() {
  const [isInitialRef, setIsInitial] = useRefState(true);

  useEffect(() => {
    setIsInitial(false);
  }, [setIsInitial]);

  return isInitialRef.current;
}

function useRefState<T>(initialValue: T): [RefObject<T>, (newValue: T, rerender?: boolean) => void] {
  const forceRender = useForceRender();

  const valueRef = useRef<T>(initialValue);

  const setValue = useCallback((newValue: T, rerender = false) => {
    if (valueRef.current !== newValue) {
      valueRef.current = newValue;

      if (rerender) {
        forceRender();
      }
    }
  }, [valueRef, forceRender]);

  return [valueRef, setValue];
}

function useForceRender() {
  const [, set] = useState(false);

  return useCallback(() => {
    set(x => !x);
  }, [set]);
}
