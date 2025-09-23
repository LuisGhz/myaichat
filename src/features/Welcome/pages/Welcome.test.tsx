import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock MODELS to have predictable grouping and links
vi.mock('core/const/Models', () => ({
  MODELS: [
    {
      name: 'Model A1',
      value: 'a1',
      link: 'https://example.com/a1',
      developBy: { name: 'DevOne', link: 'https://devone.example', imageUrl: 'https://devone.img' },
    },
    {
      name: 'Model A2',
      value: 'a2',
      link: 'https://example.com/a2',
      developBy: { name: 'DevOne', link: 'https://devone.example', imageUrl: 'https://devone.img' },
    },
    {
      name: 'Model B1',
      value: 'b1',
      link: 'https://example.com/b1',
      developBy: { name: 'DevTwo', link: 'https://devtwo.example', imageUrl: 'https://devtwo.img' },
    },
  ],
}));

// Mock ModelInfoC to keep tests focused on Welcome layout
vi.mock('../components/ModelInfoC', () => ({
  ModelInfoC: ({ model }: { model: unknown }) => {
    // access model.value safely with unknown → assert as any-like shape for test
    const m = model as { value: string };
    return <div data-testid={`model-info-${m.value}`}>info-{m.value}</div>;
  },
}));

import { Welcome } from './Welcome';

describe('Welcome page', () => {
  beforeEach(() => {
    // nothing special
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = () => render(<Welcome />);

  it('renders title and description', () => {
    renderComponent();
    expect(screen.getByText(/Welcome to My AI Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/This app is designed to help you interact/i)).toBeInTheDocument();
  });

  it('groups models by developer and shows developer header with image link', () => {
    renderComponent();

    // DevOne header appears once
    expect(screen.getAllByText('DevOne').length).toBeGreaterThanOrEqual(1);
    const devOneLink = screen.getByRole('link', { name: /DevOne/i });
    // The developer header has an image inside the link; ensure image alt matches
    const img = devOneLink.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toBe('DevOne');

    // DevTwo header appears
    expect(screen.getByText('DevTwo')).toBeInTheDocument();
  });

  it('renders each model name as an external link and renders ModelInfoC for each model', () => {
    renderComponent();

    // Model links
    expect(screen.getByText('Model A1').closest('a')).toHaveAttribute('href', 'https://example.com/a1');
    expect(screen.getByText('Model A2').closest('a')).toHaveAttribute('href', 'https://example.com/a2');
    expect(screen.getByText('Model B1').closest('a')).toHaveAttribute('href', 'https://example.com/b1');

    // ModelInfoC mocks
    expect(screen.getByTestId('model-info-a1')).toBeInTheDocument();
    expect(screen.getByTestId('model-info-a2')).toBeInTheDocument();
    expect(screen.getByTestId('model-info-b1')).toBeInTheDocument();
  });

  it('uses semantic list structure', () => {
    renderComponent();
    const ul = screen.getByRole('list');
    expect(ul).toBeInTheDocument();
    // there should be at least three listitems for the models
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThanOrEqual(3);
  });
});
