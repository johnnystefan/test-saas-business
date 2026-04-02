import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { PrimaryButton } from './primary-button';

afterEach(() => {
  cleanup();
});

describe('PrimaryButton', () => {
  it('renders its children', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<PrimaryButton onClick={onClick}>Click</PrimaryButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<PrimaryButton disabled>Disabled Button</PrimaryButton>);
    expect(
      screen.getByRole('button', { name: 'Disabled Button' }),
    ).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <PrimaryButton disabled onClick={onClick}>
        Disabled Click
      </PrimaryButton>,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Disabled Click' }),
    );
    expect(onClick).not.toHaveBeenCalled();
  });
});
