class RequestCancellation {
    private pendingRequests: Map<string, AbortController> = new Map();

    createController(key: string): AbortController {
        this.cancel(key);

        const controller = new AbortController();
        this.pendingRequests.set(key, controller);
        return controller;
    }

    cancel(key: string): void {
        const controller = this.pendingRequests.get(key);
        if (controller) {
            controller.abort();
            this.pendingRequests.delete(key);
        }
    }

    cancelAll(): void {
        this.pendingRequests.forEach((controller) => controller.abort());
        this.pendingRequests.clear();
    }

    remove(key: string): void {
        this.pendingRequests.delete(key);
    }

    isCancelled(error: any): boolean {
        // Axios lança AxiosError com code 'ERR_CANCELED' para abort
        return error?.code === "ERR_CANCELED";
    }
}

export const requestCancellation = new RequestCancellation();
