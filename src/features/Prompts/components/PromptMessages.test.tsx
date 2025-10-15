import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import { PromptMessages } from './PromptMessages';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promptSchema, PromptForm } from '../schemas/PromptSchema';

// Mock icons
vi.mock('icons/BaselinePlusIcon', () => ({
  BaselinePlusIcon: ({ className }: { className?: string }) => (
    <span data-testid="plus-icon" className={className}>+</span>
  ),
}));

vi.mock('./PromptMessage', () => ({
  PromptMessage: ({ 
    index, 
    onRemove 
  }: { 
    index: number;
    onRemove: () => void;
  }) => (
    <div data-testid={`prompt-message-${index}`}>
      <span>Message {index}</span>
      <button 
        data-testid={`remove-message-${index}`}
        onClick={onRemove}
        type="button"
      >
        Remove
      </button>
    </div>
  ),
}));

// Wrapper component to use PromptMessages with react-hook-form
const TestWrapper = ({ 
  onAddMessage,
  onRemoveMessage,
  initialMessages = [],
}: {
  onAddMessage?: () => void;
  onRemoveMessage?: (index: number) => () => Promise<void>;
  initialMessages?: PromptForm['messages'];
}) => {
  const { control } = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: '',
      content: '',
      messages: initialMessages,
    },
  });

  const addMessageMock = onAddMessage || vi.fn();
  const handleRemoveMessageMock = onRemoveMessage || (() => async () => {});

  return (
    <PromptMessages
      fields={initialMessages?.map((msg, idx) => ({ ...msg, id: `field-${idx}` })) || []}
      addMessage={addMessageMock}
      control={control}
      handleRemoveMessage={handleRemoveMessageMock}
    />
  );
};

describe('PromptMessages', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderComponent = (props?: {
    onAddMessage?: () => void;
    onRemoveMessage?: (index: number) => () => Promise<void>;
    initialMessages?: PromptForm['messages'];
  }) => {
    return render(
      <ConfigProvider>
        <TestWrapper {...props} />
      </ConfigProvider>
    );
  };

  describe('Rendering', () => {
    it('renders the component with header and add button', () => {
      renderComponent();

      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add message/i })).toBeInTheDocument();
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });

    it('displays "No messages yet" when there are no messages', () => {
      renderComponent({ initialMessages: [] });

      expect(screen.getByText('No messages yet.')).toBeInTheDocument();
    });

    it('renders messages when provided', () => {
      const messages = [
        { id: '1', role: 'User' as const, content: 'Hello' },
        { id: '2', role: 'Assistant' as const, content: 'Hi there!' },
      ];

      renderComponent({ initialMessages: messages });

      expect(screen.queryByText('No messages yet.')).not.toBeInTheDocument();
      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
      expect(screen.getByTestId('prompt-message-1')).toBeInTheDocument();
    });

    it('renders multiple messages correctly', () => {
      const messages = [
        { id: '1', role: 'User' as const, content: 'Message 1' },
        { id: '2', role: 'Assistant' as const, content: 'Message 2' },
        { id: '3', role: 'User' as const, content: 'Message 3' },
      ];

      renderComponent({ initialMessages: messages });

      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
      expect(screen.getByTestId('prompt-message-1')).toBeInTheDocument();
      expect(screen.getByTestId('prompt-message-2')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls addMessage when add button is clicked', async () => {
      const addMessageMock = vi.fn();

      renderComponent({ onAddMessage: addMessageMock });

      const addButton = screen.getByRole('button', { name: /add message/i });
      await user.click(addButton);

      expect(addMessageMock).toHaveBeenCalledTimes(1);
    });

    it('calls handleRemoveMessage with correct index when remove is clicked', async () => {
      const removeMessageMock = vi.fn(() => async () => {});
      const messages = [
        { id: '1', role: 'User' as const, content: 'Hello' },
        { id: '2', role: 'Assistant' as const, content: 'Hi there!' },
      ];

      renderComponent({ 
        initialMessages: messages,
        onRemoveMessage: removeMessageMock,
      });

      const removeButton = screen.getByTestId('remove-message-1');
      await user.click(removeButton);

      expect(removeMessageMock).toHaveBeenCalledWith(1);
    });

    it('handles multiple add message clicks', async () => {
      const addMessageMock = vi.fn();

      renderComponent({ onAddMessage: addMessageMock });

      const addButton = screen.getByRole('button', { name: /add message/i });
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      expect(addMessageMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label for add message button', () => {
      renderComponent();

      const addButton = screen.getByRole('button', { name: /add message/i });
      expect(addButton).toHaveAttribute('aria-label', 'Add Message');
    });

    it('has proper title attribute for add message button', () => {
      renderComponent();

      const addButton = screen.getByRole('button', { name: /add message/i });
      expect(addButton).toHaveAttribute('title', 'Add Message');
    });

    it('add button has type="button" to prevent form submission', () => {
      renderComponent();

      const addButton = screen.getByRole('button', { name: /add message/i });
      expect(addButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes to container', () => {
      const { container } = renderComponent();

      const mainSection = container.querySelector('section.w-10\\/12.max-w-96');
      expect(mainSection).toBeInTheDocument();
    });

    it('applies correct styling to the plus icon', () => {
      renderComponent();

      const plusIcon = screen.getByTestId('plus-icon');
      expect(plusIcon).toHaveClass('text-green-600');
      expect(plusIcon).toHaveClass('dark:text-green-300');
      expect(plusIcon).toHaveClass('hover:text-green-700');
      expect(plusIcon).toHaveClass('cursor-pointer');
    });

    it('renders messages in a flex column with gap', () => {
      const messages = [
        { id: '1', role: 'User' as const, content: 'Message 1' },
      ];
      
      const { container } = renderComponent({ initialMessages: messages });

      const messagesContainer = container.querySelector('section.mt-2.flex.flex-col.gap-4');
      expect(messagesContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty messages array', () => {
      renderComponent({ initialMessages: [] });

      expect(screen.getByText('No messages yet.')).toBeInTheDocument();
      expect(screen.queryByTestId('prompt-message-0')).not.toBeInTheDocument();
    });

    it('handles undefined messages', () => {
      renderComponent({ initialMessages: undefined });

      expect(screen.getByText('No messages yet.')).toBeInTheDocument();
    });

    it('renders correctly with single message', () => {
      const messages = [
        { id: '1', role: 'User' as const, content: 'Only message' },
      ];

      renderComponent({ initialMessages: messages });

      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
      expect(screen.queryByTestId('prompt-message-1')).not.toBeInTheDocument();
      expect(screen.queryByText('No messages yet.')).not.toBeInTheDocument();
    });

    it('handles messages with long content', () => {
      const longContent = 'A'.repeat(1000);
      const messages = [
        { id: '1', role: 'User' as const, content: longContent },
      ];

      renderComponent({ initialMessages: messages });

      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
    });
  });

  describe('Integration with PromptMessage', () => {
    it('passes correct index to each PromptMessage component', () => {
      const messages = [
        { id: '1', role: 'User' as const, content: 'First' },
        { id: '2', role: 'Assistant' as const, content: 'Second' },
        { id: '3', role: 'User' as const, content: 'Third' },
      ];

      renderComponent({ initialMessages: messages });

      expect(screen.getByText('Message 0')).toBeInTheDocument();
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    });

    it('passes onRemove handler to each PromptMessage', () => {
      const removeMessageMock = vi.fn(() => async () => {});
      const messages = [
        { id: '1', role: 'User' as const, content: 'Message' },
      ];

      renderComponent({ 
        initialMessages: messages,
        onRemoveMessage: removeMessageMock,
      });

      expect(screen.getByTestId('remove-message-0')).toBeInTheDocument();
    });
  });
});
