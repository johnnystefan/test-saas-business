import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkeletonCard } from './skeleton-card';

describe('SkeletonCard — loading behavior', () => {
  it('renders without crashing (not null)', () => {
    // Arrange + Act
    const { container } = render(<SkeletonCard />);

    // Assert
    expect(container.firstChild).not.toBeNull();
  });

  it('has the animate-pulse class for the pulsing placeholder effect', () => {
    // Arrange
    const { container } = render(<SkeletonCard />);

    // Act
    const card = container.firstChild as HTMLElement;

    // Assert — Tailwind animate-pulse drives the skeleton animation
    expect(card.className).toContain('animate-pulse');
  });

  it('has Card-consistent dimensions: rounded-2xl and padding', () => {
    // Arrange
    const { container } = render(<SkeletonCard />);

    // Act
    const card = container.firstChild as HTMLElement;

    // Assert — matches Card container styling
    expect(card.className).toContain('rounded-2xl');
    expect(card.className).toContain('p-4');
  });

  it('renders the correct number of skeleton lines (default 3)', () => {
    // Arrange
    const { container } = render(<SkeletonCard />);

    // Act — query child divs scoped to the card element (not container)
    const card = container.firstChild as HTMLElement;
    const lines = card.querySelectorAll('div');

    // Assert
    expect(lines).toHaveLength(3);
  });

  it('renders the requested number of skeleton lines when lines prop is provided', () => {
    // Arrange
    const { container } = render(<SkeletonCard lines={5} />);

    // Act
    const card = container.firstChild as HTMLElement;
    const lines = card.querySelectorAll('div');

    // Assert
    expect(lines).toHaveLength(5);
  });

  it('each skeleton line has the h-4 height class matching Card row dimensions', () => {
    // Arrange
    const { container } = render(<SkeletonCard />);

    // Act — query child divs scoped to the card element
    const card = container.firstChild as HTMLElement;
    const lines = card.querySelectorAll('div');

    // Assert — every line carries h-4 for consistent height
    lines.forEach((line) => {
      expect((line as HTMLElement).className).toContain('h-4');
    });
  });
});
