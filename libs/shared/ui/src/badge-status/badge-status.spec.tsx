import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BadgeStatus } from './badge-status';

describe('BadgeStatus', () => {
  it('renders ACTIVE status label by default', () => {
    render(<BadgeStatus status="active" />);
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('renders custom label when provided', () => {
    render(<BadgeStatus status="active" label="Active Member" />);
    expect(screen.getByText('Active Member')).toBeInTheDocument();
  });

  it('renders EXPIRED status', () => {
    render(<BadgeStatus status="expired" />);
    expect(screen.getByText('expired')).toBeInTheDocument();
  });

  it('renders PENDING status', () => {
    render(<BadgeStatus status="pending" />);
    expect(screen.getByText('pending')).toBeInTheDocument();
  });
});

describe('BadgeStatus — color behavior', () => {
  it('displays with the primary accent color (#22C55E) when status is active', () => {
    // Arrange
    const { container } = render(<BadgeStatus status="active" />);

    // Act
    const badge = container.firstChild as HTMLElement;

    // Assert — VARIANT_CLASSES['active'] = 'bg-[#22C55E]/20 text-[#22C55E]'
    expect(badge.className).toContain('bg-[#22C55E]/20');
    expect(badge.className).toContain('text-[#22C55E]');
  });

  it('does NOT apply the active accent color when status is expired', () => {
    // Arrange
    const { container } = render(<BadgeStatus status="expired" />);

    // Act
    const badge = container.firstChild as HTMLElement;

    // Assert — expired uses red, not green
    expect(badge.className).not.toContain('bg-[#22C55E]/20');
    expect(badge.className).not.toContain('text-[#22C55E]');
    expect(badge.className).toContain('text-red-400');
  });
});
