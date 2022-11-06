import { Injectable } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackSignature = (params: any) => unknown;

@Injectable({
    providedIn: 'root',
})
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
export class SocketTestHelper {
    private callbacks = new Map<string, CallbackSignature[]>();

    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        this.callbacks.get(event)!.push(callback);
    }

    once(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        this.callbacks.get(event)!.push(callback);
    }

    emit(): void {
        return;
    }

    disconnect(): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    peerSideEmit(event: string, params?: any) {
        if (!this.callbacks.has(event)) {
            return;
        }

        for (const callback of this.callbacks.get(event)!) {
            callback(params);
        }
    }
}
