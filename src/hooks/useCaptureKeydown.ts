import { useEffect, useRef } from 'react';

type KeydownHandler = (event: KeyboardEvent) => void;

export function useCaptureKeydown(handler: KeydownHandler) {
  const handlerRef = useRef<KeydownHandler>(handler);

  handlerRef.current = handler;

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      handlerRef.current(event);
    };

    document.addEventListener('keydown', listener, { capture: true });

    return () => document.removeEventListener('keydown', listener, { capture: true });
  }, []);
}
