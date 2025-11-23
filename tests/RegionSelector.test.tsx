
import { render, screen, fireEvent } from '@testing-library/react';
import { RegionSelector } from '../components/RegionSelector';
import { expect, test, vi } from 'vitest';

test('onSelect is not called after component unmounts', async () => {
  const onSelect = vi.fn();
  const { unmount } = render(<RegionSelector onSelect={onSelect} t={(key) => key} />);

  const regionButton = screen.getByText('Turkey');
  fireEvent.click(regionButton);

  unmount();

  // Wait for the timeout to expire
  await new Promise(resolve => setTimeout(resolve, 1100));

  expect(onSelect).not.toHaveBeenCalled();
});
