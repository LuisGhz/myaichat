import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the CodeBlock component before importing the hook so the hook picks up the mock
vi.mock('../components/CodeBlock', () => ({
  CodeBlock: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="code-block">{children}</div>
  ),
}));

import { useMarkDown } from './useMarkdown';

// Helper to render the hook output. Tests should call renderComponent() to avoid repetition.
const TestComponent = ({ text }: { text: string }) => {
  const format = useMarkDown();
  return <div data-testid="root">{format(text)}</div>;
};

const renderComponent = (text: string) => render(<TestComponent text={text} />);

describe('useMarkDown', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // cleanup handled by testing-library's automatic cleanup between tests
  });

  it('renders inline code as a code element (not using CodeBlock)', () => {
    renderComponent('This is `inline` code');

    // The inline code text should be present
    const inline = screen.getByText('inline');
    expect(inline).toBeDefined();

    // Ensure the CodeBlock mock is not used for inline code
    expect(screen.queryByTestId('code-block')).toBeNull();

    // Inline code should render inside a <code> element
    const codeEl = inline.closest('code');
    expect(codeEl).toBeTruthy();
    // And it should not be inside a <pre>
    const pre = codeEl?.closest('pre');
    expect(pre).toBeNull();
  });

  it('uses CodeBlock for fenced code with language', () => {
    const md = "```javascript\nconsole.log('x')\n```";
    renderComponent(md);

    // Our mock CodeBlock renders with data-testid="code-block"
    const cb = screen.getByTestId('code-block');
    expect(cb).toBeDefined();
    // It should contain the code text
    expect(cb.textContent).toContain("console.log('x')");
  });

  it('renders fenced code without language as a regular pre/code (no CodeBlock)', () => {
    const md = "```\\nplain\\ncode\\n```";
    renderComponent(md);

    // Should not use the CodeBlock mock
    expect(screen.queryByTestId('code-block')).toBeNull();

    // The code text should still be present (may be wrapped with newlines)
    expect(screen.getByText(/plain/)).toBeDefined();
  });
});
