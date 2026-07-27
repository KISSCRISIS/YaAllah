'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { GlassPanel } from '../primitives/GlassPanel';
import { cn } from '../utils/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null
  );
}

function setBackgroundInert(modalRootEl: HTMLElement, hidden: boolean) {
  let topLevelEl: HTMLElement | null = modalRootEl;
  while (topLevelEl && topLevelEl.parentElement !== document.body) {
    topLevelEl = topLevelEl.parentElement;
  }
  if (!topLevelEl) return;
  Array.from(document.body.children).forEach((child) => {
    if (child === topLevelEl) return;
    if (hidden) {
      child.setAttribute('aria-hidden', 'true');
      child.setAttribute('inert', '');
    } else {
      child.removeAttribute('aria-hidden');
      child.removeAttribute('inert');
    }
  });
}

export function Modal({ open, onClose, titleId, title, children, footer }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const modalRootEl = panelRef.current;
    if (modalRootEl) setBackgroundInert(modalRootEl, true);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = getFocusableElements(panelRef.current);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (active === first || !panelRef.current.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last || !panelRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (modalRootEl) setBackgroundInert(modalRootEl, false);
      previouslyFocusedRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-seg-base ease-seg-standard">
      <GlassPanel ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} elevated className="w-full max-w-lg outline-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold text-seg-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-seg-sm p-1 text-seg-text-secondary hover:bg-seg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </GlassPanel>
    </div>
  );
}
