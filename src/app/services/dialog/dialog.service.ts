import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';

import { DialogContainerComponent } from './dialog-container/dialog-container';
import { DialogRef } from './dialog-ref';
import { DIALOG_DATA, DIALOG_REF } from './dialog.tokens';

export interface DialogConfig<D = unknown> {
  /** Data passed to the dialog component via the DIALOG_DATA token. */
  data?: D;
  /** Close the dialog when the backdrop is clicked. Defaults to true. */
  backdropClose?: boolean;
  /** Close the dialog when the Escape key is pressed. Defaults to true. */
  closeOnEscape?: boolean;
  /** Explicit width for the dialog panel (e.g. '480px'). */
  width?: string;
}

/** Duration in ms that matches the CSS close transition. */
const CLOSE_ANIMATION_MS = 200;

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  /**
   * Dynamically opens `component` inside a dialog overlay.
   *
   * @param component  The standalone Angular component to render.
   * @param config     Optional dialog configuration.
   * @returns          A `DialogRef` for controlling and reacting to the dialog.
   *
   * @example
   * const ref = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Delete?' } });
   * ref.afterClosed$.subscribe(result => console.log(result));
   */
  open<T, R = unknown>(component: Type<T>, config: DialogConfig = {}): DialogRef<R> {
    const dialogRef = new DialogRef<R>();

    // Mount point appended to <body>
    const hostElement = document.createElement('div');
    document.body.appendChild(hostElement);

    // Custom injector so the content component can access DIALOG_DATA / DIALOG_REF
    const injector = Injector.create({
      providers: [
        { provide: DIALOG_DATA, useValue: config.data ?? null },
        { provide: DIALOG_REF, useValue: dialogRef },
      ],
      parent: this.environmentInjector,
    });

    // Create the container component
    const containerRef = createComponent(DialogContainerComponent, {
      environmentInjector: this.environmentInjector,
      hostElement,
    });

    this.appRef.attachView(containerRef.hostView);

    // Apply config inputs
    if (config.backdropClose !== undefined) {
      containerRef.setInput('backdropClose', config.backdropClose);
    }
    if (config.closeOnEscape !== undefined) {
      containerRef.setInput('closeOnEscape', config.closeOnEscape);
    }
    if (config.width) {
      containerRef.setInput('width', config.width);
    }

    // Listen for close requests from the container (backdrop click / Escape)
    containerRef.instance.closeRequested.subscribe(() => dialogRef.close());

    // Run CD so viewChild signal queries (host, panel) resolve
    containerRef.changeDetectorRef.detectChanges();

    // Render the content component inside the container's ng-container
    containerRef.instance.host().createComponent(component, { injector });
    containerRef.changeDetectorRef.detectChanges();

    // Wire up the close callback
    dialogRef._setCloseCallback(() => {
      // Animate out
      containerRef.instance.isVisible.set(false);
      containerRef.changeDetectorRef.detectChanges();

      setTimeout(() => {
        this.appRef.detachView(containerRef.hostView);
        containerRef.destroy();
        hostElement.remove();
      }, CLOSE_ANIMATION_MS);
    });

    // Animate in on the next paint so the CSS transition fires
    requestAnimationFrame(() => {
      containerRef.instance.isVisible.set(true);
      containerRef.changeDetectorRef.detectChanges();
      // Move focus into the panel so Escape key events are captured
      containerRef.instance.focusPanel();
    });

    return dialogRef;
  }
}
