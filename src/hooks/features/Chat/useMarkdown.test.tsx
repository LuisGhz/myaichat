import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // For additional matchers like toBeInTheDocument, toHaveAttribute
import { useMarkDown } from './useMarkdown';
import React from 'react'; // Required for JSX

// Mock the CodeBlock component
// The path 'components/CodeBlock' should match how it's resolved in your project (e.g., via tsconfig paths or relative path)
vi.mock('components/CodeBlock', () => ({
  CodeBlock: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="mocked-code-block" data-classname={className}>
      {children}
    </div>
  ),
}));

describe('useMarkDown hook', () => {
  describe('formatToMarkDown function', () => {
    const formatToMarkDown = useMarkDown();

    it('should render plain text correctly', () => {
      const text = "Hello World";
      const { getByText } = render(formatToMarkDown(text));
      expect(getByText("Hello World")).toBeInTheDocument();
    });

    it('should render inline code correctly as a <code> tag and not use CodeBlock', () => {
      const text = "This is `inline code`.";
      const { getByText, queryByTestId } = render(formatToMarkDown(text));

      const inlineCodeElement = getByText("inline code");
      expect(inlineCodeElement.tagName).toBe('CODE');
      // Ensure it's the standard <code> tag, not our custom CodeBlock
      expect(queryByTestId('mocked-code-block')).toBeNull();
      // Inline code typically doesn't have a language- specific class from our logic
      expect(inlineCodeElement).not.toHaveClass(/language-/);
    });

    it('should render a fenced code block with a language using CodeBlock', () => {
      const text = "```javascript\nconsole.log('test');\n```";
      const { getByTestId, getByText } = render(formatToMarkDown(text));

      const mockedCodeBlock = getByTestId('mocked-code-block');
      expect(mockedCodeBlock).toBeInTheDocument();
      expect(mockedCodeBlock).toHaveAttribute('data-classname', 'language-javascript');
      
      // Check that the content of the code block is rendered
      // ReactMarkdown might pass children as an array with the string, which CodeBlock receives.
      // The mock directly renders children, so text content should be available.
      expect(getByText("console.log('test');")).toBeInTheDocument();
    });
    
    it('should render bold text correctly', () => {
      const text = "This is **bold text**.";
      const { getByText } = render(formatToMarkDown(text));
      const boldElement = getByText("bold text");
      expect(boldElement.tagName).toBe('STRONG');
    });

    it('should render italic text correctly', () => {
      const text = "This is *italic text*.";
      const { getByText } = render(formatToMarkDown(text));
      const italicElement = getByText("italic text");
      expect(italicElement.tagName).toBe('EM');
    });

    it('should render links correctly using remarkGfm', () => {
      const text = "Visit [our website](http://example.com).";
      const { getByRole } = render(formatToMarkDown(text));
      const linkElement = getByRole('link', { name: "our website" });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', 'http://example.com');
    });

    it('should render strikethrough text correctly using remarkGfm', () => {
      const text = "This is ~~strikethrough~~ text.";
      const { getByText } = render(formatToMarkDown(text));
      const strikeElement = getByText("strikethrough");
      expect(strikeElement.tagName).toBe('DEL');
    });

    it('should handle mixed content: plain text, inline code, and fenced code block', () => {
      const text = "Plain text before. `inline code here`. \n\n```python\nprint('hello')\n```\n\nPlain text after.";
      const { getByText, getByTestId } = render(formatToMarkDown(text));

      // Check plain text parts
      expect(getByText("Plain text before.", { exact: false })).toBeInTheDocument();
      expect(getByText("Plain text after.", { exact: false })).toBeInTheDocument();

      // Check inline code
      const inlineCodeElement = getByText("inline code here");
      expect(inlineCodeElement.tagName).toBe('CODE');
      expect(getByTestId('mocked-code-block')).toBeInTheDocument(); // one for the fenced block

      // Check fenced code block
      const mockedCodeBlock = getByTestId('mocked-code-block'); // This will find the one instance
      expect(mockedCodeBlock).toHaveAttribute('data-classname', 'language-python');
      expect(getByText("print('hello')")).toBeInTheDocument();
    });

    it('should return a React element', () => {
        const text = "Some text";
        const result = formatToMarkDown(text);
        expect(React.isValidElement(result)).toBe(true);
      });
  });
});