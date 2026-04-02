/**
 * ui.store — unit tests
 *
 * Tests toast management actions: addToast, removeToast, clearToasts.
 * Uses jsdom environment (crypto.randomUUID is available in jsdom).
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { useUiStore } from './ui.store';

// ── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Reset toasts before each test
  useUiStore.getState().clearToasts();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe('ui.store', () => {
  describe('addToast()', () => {
    it('adds a toast with the given message and variant', () => {
      // Arrange
      const { addToast } = useUiStore.getState();

      // Act
      addToast({ message: 'Login successful', variant: 'success' });

      // Assert
      const { toasts } = useUiStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe('Login successful');
      expect(toasts[0].variant).toBe('success');
    });

    it('assigns a non-empty unique id to each toast', () => {
      // Arrange
      const { addToast } = useUiStore.getState();

      // Act
      addToast({ message: 'A', variant: 'success' });
      addToast({ message: 'B', variant: 'error' });

      // Assert
      const { toasts } = useUiStore.getState();
      expect(toasts[0].id).toBeTruthy();
      expect(toasts[1].id).toBeTruthy();
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it('accumulates multiple toasts in order', () => {
      // Arrange
      const { addToast } = useUiStore.getState();

      // Act
      addToast({ message: 'First', variant: 'info' });
      addToast({ message: 'Second', variant: 'success' });
      addToast({ message: 'Third', variant: 'error' });

      // Assert
      const { toasts } = useUiStore.getState();
      expect(toasts).toHaveLength(3);
      expect(toasts[0].message).toBe('First');
      expect(toasts[1].message).toBe('Second');
      expect(toasts[2].message).toBe('Third');
    });

    it('supports all valid variants: success, error, info', () => {
      // Arrange & Act
      useUiStore.getState().addToast({ message: 'ok', variant: 'success' });
      useUiStore.getState().addToast({ message: 'fail', variant: 'error' });
      useUiStore.getState().addToast({ message: 'note', variant: 'info' });

      // Assert
      const { toasts } = useUiStore.getState();
      const variants = toasts.map((t) => t.variant);
      expect(variants).toContain('success');
      expect(variants).toContain('error');
      expect(variants).toContain('info');
    });
  });

  describe('removeToast()', () => {
    it('removes only the toast with the matching id', () => {
      // Arrange
      useUiStore.getState().addToast({ message: 'Keep', variant: 'info' });
      useUiStore
        .getState()
        .addToast({ message: 'Remove me', variant: 'error' });
      const idToRemove = useUiStore.getState().toasts[1].id;

      // Act
      useUiStore.getState().removeToast(idToRemove);

      // Assert
      const { toasts } = useUiStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe('Keep');
    });

    it('does nothing when the id does not match any toast', () => {
      // Arrange
      useUiStore.getState().addToast({ message: 'Stay', variant: 'success' });

      // Act
      useUiStore.getState().removeToast('non-existent-id');

      // Assert
      expect(useUiStore.getState().toasts).toHaveLength(1);
    });

    it('leaves an empty array when the last toast is removed', () => {
      // Arrange
      useUiStore.getState().addToast({ message: 'Only one', variant: 'info' });
      const id = useUiStore.getState().toasts[0].id;

      // Act
      useUiStore.getState().removeToast(id);

      // Assert
      expect(useUiStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('clearToasts()', () => {
    it('removes all toasts at once', () => {
      // Arrange
      useUiStore.getState().addToast({ message: 'A', variant: 'success' });
      useUiStore.getState().addToast({ message: 'B', variant: 'error' });
      useUiStore.getState().addToast({ message: 'C', variant: 'info' });

      // Act
      useUiStore.getState().clearToasts();

      // Assert
      expect(useUiStore.getState().toasts).toHaveLength(0);
    });

    it('is idempotent when called on an already-empty list', () => {
      // Act
      useUiStore.getState().clearToasts();

      // Assert — no error thrown
      expect(useUiStore.getState().toasts).toHaveLength(0);
    });
  });
});
