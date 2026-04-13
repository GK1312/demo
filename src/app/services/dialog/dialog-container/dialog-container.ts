import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-dialog-container',
  templateUrl: './dialog-container.html',
  styleUrl: './dialog-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.escape)': 'onEscapeKey()',
  },
})
export class DialogContainerComponent {
  /** ViewContainerRef used by DialogService to render the content component. */
  readonly host = viewChild.required('host', { read: ViewContainerRef });

  /** Reference to the panel element for programmatic focus. */
  readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  readonly backdropClose = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly width = input<string>('');

  /** Emitted when the user requests a close (backdrop click or Escape key). */
  readonly closeRequested = output<void>();

  readonly isVisible = signal(false);

  onBackdropClick(): void {
    if (this.backdropClose()) {
      this.closeRequested.emit();
    }
  }

  onEscapeKey(): void {
    if (this.closeOnEscape()) {
      this.closeRequested.emit();
    }
  }

  /** Focus the panel so keyboard events are captured. */
  focusPanel(): void {
    this.panel().nativeElement.focus();
  }
}
