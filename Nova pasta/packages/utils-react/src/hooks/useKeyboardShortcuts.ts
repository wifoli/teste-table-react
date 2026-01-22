import { useEffect, useCallback } from "react";

export type KeyCombo = string;

export interface ShortcutConfig {
    [key: KeyCombo]: (event: KeyboardEvent) => void;
}

/**
 * em pt: Analisar string de combinação de teclas
 * Example: "ctrl+s", "cmd+shift+z", "alt+f4"
 */
function parseKeyCombo(combo: string): {
    key: string;
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    shift: boolean;
} {
    const parts = combo.toLowerCase().split("+");
    const key = parts[parts.length - 1];

    return {
        key,
        ctrl: parts.includes("ctrl"),
        meta: parts.includes("cmd") || parts.includes("meta"),
        alt: parts.includes("alt"),
        shift: parts.includes("shift"),
    };
}

/**
 * Verifica se o evento de teclado corresponde à combinação
 */
function matchesCombo(event: KeyboardEvent, combo: string): boolean {
    const parsed = parseKeyCombo(combo);
    const eventKey = event.key.toLowerCase();

    // Teclas especiais
    const keyMap: Record<string, string> = {
        escape: "esc",
        " ": "space",
    };

    const normalizedEventKey = keyMap[eventKey] || eventKey;
    const normalizedComboKey = keyMap[parsed.key] || parsed.key;

    return (
        normalizedEventKey === normalizedComboKey &&
        event.ctrlKey === parsed.ctrl &&
        event.metaKey === parsed.meta &&
        event.altKey === parsed.alt &&
        event.shiftKey === parsed.shift
    );
}

/**
 * Hook para atalhos de teclado
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig, enabled: boolean = true) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            for (const [combo, handler] of Object.entries(shortcuts)) {
                if (matchesCombo(event, combo)) {
                    event.preventDefault();
                    handler(event);
                    break;
                }
            }
        },
        [shortcuts, enabled],
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);
}

/**
 * Atalhos comuns helper
 */
export const commonShortcuts = {
    save: "ctrl+s",
    close: "esc",
    search: "/",
    copy: "ctrl+c",
    paste: "ctrl+v",
    undo: "ctrl+z",
    redo: "ctrl+shift+z",
    selectAll: "ctrl+a",
};
