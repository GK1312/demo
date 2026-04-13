import { Subject } from 'rxjs';

export class DialogRef<R = unknown> {
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Observable that emits the result when the dialog is closed. */
  readonly afterClosed$ = this._afterClosed.asObservable();

  private _closeCallback: ((result?: R) => void) | null = null;

  /** @internal — called by DialogService to wire up destroy logic. */
  _setCloseCallback(cb: (result?: R) => void): void {
    this._closeCallback = cb;
  }

  /** Close the dialog and optionally pass a result back to the opener. */
  close(result?: R): void {
    this._closeCallback?.(result);
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }
}
