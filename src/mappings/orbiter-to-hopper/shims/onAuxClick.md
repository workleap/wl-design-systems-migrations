onAuxClick is rarely used in modern web applications, as it is primarily intended for mouse devices that support auxiliary buttons (like the middle mouse button). Most applications today use onClick/onPress for handling click events, which works across all devices including touchscreens.

Since React-Aria does not provide onAuxClick, and that React-Aria prevents us from passing extra props to the underlying DOM element, we first need to get access to the underlying DOM element using the useRef hook. Then, we can add an event listener for the auxclick event on that element.

```tsx
import { Link, type LinkProps } from "@hopper-ui/components";
import { useEffect, useRef } from "react";

interface LinkWithAuxProps extends LinkProps {
    onAuxClick?: () => void;
}

function LinkWithAux({ onAuxClick, ...rest }: LinkWithAuxProps) {
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            const handleAuxClick = () => {
                onAuxClick?.();
            };
            element.addEventListener("auxclick", handleAuxClick);

            return () => {
                element.removeEventListener("auxclick", handleAuxClick);
            };
        }
    }, [onAuxClick]);

    return (
        <Link ref={ref} {...rest} />
    );
}
```

