import { SubscribableNode } from './nodes/base/SubscribableNode';

class TrackStack {
  private static readonly stack: (Set<SubscribableNode> | null)[] = [];
  private static _isTracking: boolean = false;

  static get isTracking(): boolean {
    return this._isTracking;
  }

  static push() {
    this._isTracking = true;
    this.stack.push(new Set());
  }

  static pushTrackPause() {
    this._isTracking = false;
    this.stack.push(null);
  }

  static track(subscription: SubscribableNode) {
    if (!this._isTracking) return;
    this.stack[this.stack.length - 1]!.add(subscription);
  }

  static pop() {
    this._isTracking = this.stack[this.stack.length - 2] != null;
    return this.stack.pop() ?? null;
  }
}

export { TrackStack };
