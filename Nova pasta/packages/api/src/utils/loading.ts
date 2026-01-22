import { LoadingState, ApiError } from "../types";

type LoadingStateListener = (state: LoadingState) => void;

class LoadingStateManager {
    private listeners: Map<string, Set<LoadingStateListener>> = new Map();
    private states: Map<string, LoadingState> = new Map();

    private getInitialState(): LoadingState {
        return {
            isLoading: false,
            error: null,
        };
    }

    getState(key: string): LoadingState {
        return this.states.get(key) || this.getInitialState();
    }

    setState(key: string, state: Partial<LoadingState>): void {
        const currentState = this.getState(key);
        const newState = { ...currentState, ...state };
        this.states.set(key, newState);
        this.notifyListeners(key, newState);
    }

    startLoading(key: string): void {
        this.setState(key, { isLoading: true, error: null });
    }

    stopLoading(key: string, error?: ApiError): void {
        this.setState(key, { isLoading: false, error: error || null });
    }

    subscribe(key: string, listener: LoadingStateListener): () => void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key)!.add(listener);

        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(key);
            if (listeners) {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    this.listeners.delete(key);
                }
            }
        };
    }

    private notifyListeners(key: string, state: LoadingState): void {
        const listeners = this.listeners.get(key);
        if (listeners) {
            listeners.forEach((listener) => listener(state));
        }
    }

    reset(key: string): void {
        this.states.delete(key);
        this.notifyListeners(key, this.getInitialState());
    }

    resetAll(): void {
        this.states.clear();
        this.listeners.forEach((_, key) => {
            this.notifyListeners(key, this.getInitialState());
        });
    }
}

export const loadingStateManager = new LoadingStateManager();
