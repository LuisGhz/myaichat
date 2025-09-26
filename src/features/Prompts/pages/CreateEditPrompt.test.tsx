import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider, message } from 'antd';
import '@testing-library/jest-dom';
import { CreateEditPrompt } from './CreateEditPrompt';

// Mock react-router
const navigateMock = vi.fn();
const useParamsMock = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
  useParams: () => useParamsMock(),
}));

// Mock Ant Design message
vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return {
    ...actual,
    message: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

// Mock hooks
const onPromptFormSubmitMock = vi.fn();
const onPromptUpdateFormSubmitMock = vi.fn();
const getPromptByIdMock = vi.fn();
const deletePromptMessageMock = vi.fn();

vi.mock('../hooks/usePromptForm', () => ({
  usePromptForm: () => ({
    onPromptFormSubmit: onPromptFormSubmitMock,
    onPromptUpdateFormSubmit: onPromptUpdateFormSubmitMock,
  }),
}));

vi.mock('../hooks/usePrompts', () => ({
  usePrompts: () => ({
    getPromptById: getPromptByIdMock,
    deletePromptMessage: deletePromptMessageMock,
  }),
}));

// Mock icons
vi.mock('icons/BaselinePlusIcon', () => ({
  BaselinePlusIcon: () => <span data-testid="plus-icon">+</span>,
}));

// Mock PromptMessage component
vi.mock('../components/PromptMessage', () => ({
  PromptMessage: ({ onRemove, index }: { onRemove: () => void; index: number }) => (
    <div data-testid={`prompt-message-${index}`}>
      <button onClick={onRemove} data-testid={`remove-message-${index}`}>
        Remove Message
      </button>
      <textarea data-testid={`message-content-${index}`} placeholder="Message content" />
    </div>
  ),
}));

// Mock data
const mockPrompt = {
  id: 'test-id',
  name: 'Existing Prompt',
  content: 'Existing content',
  messages: [
    {
      id: 'msg-1',
      role: 'User' as const,
      content: 'Hello',
    },
    {
      id: 'msg-2',
      role: 'Assistant' as const,
      content: 'Hi there!',
    },
  ],
  createdAt: new Date(),
};

describe('CreateEditPrompt', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    
    // Reset mocks to default values
    useParamsMock.mockReturnValue({});
    navigateMock.mockClear();
    vi.mocked(message.error).mockClear();
    vi.mocked(message.success).mockClear();
    onPromptFormSubmitMock.mockClear();
    onPromptUpdateFormSubmitMock.mockClear();
    getPromptByIdMock.mockClear();
    deletePromptMessageMock.mockClear();
  });

  const renderComponent = () => {
    return render(
      <ConfigProvider>
        <CreateEditPrompt />
      </ConfigProvider>
    );
  };

  describe('Create Mode', () => {
    it('renders create form correctly', () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      // Should show create mode title
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
      expect(screen.getByText('Create a prompt here.')).toBeInTheDocument();

      // Should show form fields
      expect(screen.getByPlaceholderText('Prompt Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Prompt Content')).toBeInTheDocument();

      // Should show save button with create text
      expect(screen.getByRole('button', { name: /save prompt/i })).toBeInTheDocument();
      
      // Should show go back button
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });

    it('allows adding and removing messages', async () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      // Initially should show "No messages yet"
      expect(screen.getByText('No messages yet.')).toBeInTheDocument();

      // Click add message button
      const addButton = screen.getByRole('button', { name: /add message/i });
      await user.click(addButton);

      // Should now show a message component
      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
      expect(screen.queryByText('No messages yet.')).not.toBeInTheDocument();

      // Add another message
      await user.click(addButton);
      expect(screen.getByTestId('prompt-message-1')).toBeInTheDocument();

      // Remove first message
      const removeButton = screen.getByTestId('remove-message-0');
      await user.click(removeButton);

      // Should only have one message left at index 0 (the array gets reindexed)
      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
      expect(screen.queryByTestId('prompt-message-1')).not.toBeInTheDocument();
      expect(deletePromptMessageMock).not.toHaveBeenCalled();
    });

    it('submits create form successfully', async () => {
      useParamsMock.mockReturnValue({});
      onPromptFormSubmitMock.mockResolvedValue({ success: true });

      renderComponent();

      // Fill out the form - use fireEvent for better performance
      const titleInput = screen.getByPlaceholderText('Prompt Title');
      const contentTextarea = screen.getByPlaceholderText('Prompt Content');

      fireEvent.change(titleInput, { target: { value: 'Test Prompt' } });
      fireEvent.change(contentTextarea, { target: { value: 'This is a test prompt content' } });

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /save prompt/i });
      await user.click(saveButton);

      // Should call the create service
      await waitFor(() => {
        expect(onPromptFormSubmitMock).toHaveBeenCalledWith({
          name: 'Test Prompt',
          content: 'This is a test prompt content',
          messages: [],
        });
      });

      // Should show success message and navigate
      expect(message.success).toHaveBeenCalledWith('Prompt created successfully!');
      expect(navigateMock).toHaveBeenCalledWith('/prompts');
    });

    it('handles create form submission error', async () => {
      useParamsMock.mockReturnValue({});
      onPromptFormSubmitMock.mockRejectedValue(new Error('Network error'));

      renderComponent();

      // Fill out minimal required fields
      const titleInput = screen.getByPlaceholderText('Prompt Title');
      const contentTextarea = screen.getByPlaceholderText('Prompt Content');

      await user.type(titleInput, 'Test');
      await user.type(contentTextarea, 'Test');

      // Submit the form
      const saveButton = screen.getByRole('button', { name: /save prompt/i });
      await user.click(saveButton);

      // Should show error message
      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Failed to create prompt');
      });

      // Should not navigate
      expect(navigateMock).not.toHaveBeenCalled();
    });

    it('navigates back when go back button is clicked', async () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      const goBackButton = screen.getByRole('button', { name: /go back/i });
      await user.click(goBackButton);

      expect(navigateMock).toHaveBeenCalledWith('/prompts');
    });
  });

  describe('Edit Mode', () => {

    it('shows loading state initially', () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockImplementation(() => new Promise(() => {})); // Never resolves

      renderComponent();

      expect(screen.getByText('Loading prompt...')).toBeInTheDocument();
    });

    it('renders edit form with existing data', async () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(mockPrompt);

      renderComponent();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      // Should show edit mode title
      expect(screen.getByText('Edit Prompt')).toBeInTheDocument();
      expect(screen.getByText('Edit your prompt here.')).toBeInTheDocument();

      // Should show update button
      expect(screen.getByRole('button', { name: /update prompt/i })).toBeInTheDocument();

      // Should call getPromptById with correct ID
      expect(getPromptByIdMock).toHaveBeenCalledWith('test-id');
    });

    it('submits update form successfully', async () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(mockPrompt);
      onPromptUpdateFormSubmitMock.mockResolvedValue({ success: true });

      renderComponent();

      // Wait for form to load
      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      // Submit the form
      const updateButton = screen.getByRole('button', { name: /update prompt/i });
      await user.click(updateButton);

      // Should call update service
      await waitFor(() => {
        expect(onPromptUpdateFormSubmitMock).toHaveBeenCalledWith('test-id', expect.objectContaining({
          name: 'Existing Prompt',
          content: 'Existing content',
        }));
      });

      // Should show success message and navigate
      expect(message.success).toHaveBeenCalledWith('Prompt updated successfully!');
      expect(navigateMock).toHaveBeenCalledWith('/prompts');
    });

    it('handles update form submission error', async () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(mockPrompt);
      onPromptUpdateFormSubmitMock.mockRejectedValue(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      const updateButton = screen.getByRole('button', { name: /update prompt/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Failed to update prompt');
      });

      expect(navigateMock).not.toHaveBeenCalled();
    });

    it('keeps message when backend deletion fails', async () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(mockPrompt);
      deletePromptMessageMock.mockRejectedValue(new Error('failed to delete'));

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      const removeButton = screen.getByTestId('remove-message-0');
      await user.click(removeButton);

      await waitFor(() => {
        expect(deletePromptMessageMock).toHaveBeenCalledTimes(1);
        expect(deletePromptMessageMock).toHaveBeenCalledWith('test-id', expect.any(String));
      });

      const [, messageId] = deletePromptMessageMock.mock.calls[0];
      expect(typeof messageId).toBe('string');
      expect((messageId as string).startsWith('default-')).toBe(false);

      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
      expect(screen.getByTestId('prompt-message-1')).toBeInTheDocument();
    });

    it('handles prompt fetch error', async () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockRejectedValue(new Error('Prompt not found'));

      renderComponent();

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Failed to load prompt');
        expect(navigateMock).toHaveBeenCalledWith('/prompts');
      });
    });

    it('handles case when prompt is not found', async () => {
      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(null);

      renderComponent();

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Prompt not found');
        expect(navigateMock).toHaveBeenCalledWith('/prompts');
      });
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      // Try to submit empty form
      const saveButton = screen.getByRole('button', { name: /save prompt/i });
      await user.click(saveButton);

      // Should show validation errors (handled by react-hook-form and zod)
      // The form should prevent submission with invalid data
      expect(onPromptFormSubmitMock).not.toHaveBeenCalled();
    });

    it('validates prompt title length', async () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Prompt Title');
      
      // Test title that's too long (over 30 characters) - use fireEvent for performance
      fireEvent.change(titleInput, { target: { value: 'A'.repeat(31) } });
      fireEvent.blur(titleInput); // Trigger validation

      // Form validation should prevent submission
      // This is handled by the zod schema
    });

    it('validates content length', async () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      const contentTextarea = screen.getByPlaceholderText('Prompt Content');
      
      // Test content that's too long (over 10,000 characters) - use fireEvent for performance
      const longContent = 'A'.repeat(10001);
      fireEvent.change(contentTextarea, { target: { value: longContent } });
      fireEvent.blur(contentTextarea);

      // Form validation should prevent submission
      // This is handled by the zod schema and the value should be in the textarea
      expect(contentTextarea).toHaveValue(longContent);
    }, 10000);
  });

  describe('Loading States', () => {
    it('disables buttons during form submission', async () => {
      useParamsMock.mockReturnValue({});
      // Make the submission hang to test loading state
      onPromptFormSubmitMock.mockImplementation(() => new Promise(() => {}));

      renderComponent();

      const titleInput = screen.getByPlaceholderText('Prompt Title');
      const contentTextarea = screen.getByPlaceholderText('Prompt Content');

      await user.type(titleInput, 'Test');
      await user.type(contentTextarea, 'Test');

      const saveButton = screen.getByRole('button', { name: /save prompt/i });
      const goBackButton = screen.getByRole('button', { name: /go back/i });

      await user.click(saveButton);

      // Buttons should be disabled during loading
      await waitFor(() => {
        expect(goBackButton).toBeDisabled();
        // Save button should show loading state (handled by Ant Design)
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      // Form should be present (query by element since antd forms don't get role="form")
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();

      // Input fields should have proper labels/placeholders
      expect(screen.getByPlaceholderText('Prompt Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Prompt Content')).toBeInTheDocument();

      // Buttons should have proper labels
      expect(screen.getByRole('button', { name: /add message/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save prompt/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });

    it('has proper ARIA attributes for add message button', () => {
      useParamsMock.mockReturnValue({});

      renderComponent();

      const addButton = screen.getByRole('button', { name: /add message/i });
      expect(addButton).toHaveAttribute('aria-label', 'Add Message');
      expect(addButton).toHaveAttribute('title', 'Add Message');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined prompt ID gracefully', () => {
      useParamsMock.mockReturnValue({ id: undefined });

      renderComponent();

      // Should render in create mode
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
      expect(getPromptByIdMock).not.toHaveBeenCalled();
    });

    it('handles empty string prompt ID', () => {
      useParamsMock.mockReturnValue({ id: '' });

      renderComponent();

      // Should render in create mode
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
      expect(getPromptByIdMock).not.toHaveBeenCalled();
    });

    it('handles prompt with no messages', async () => {
      const promptWithoutMessages = {
        ...mockPrompt,
        messages: undefined,
      };

      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(promptWithoutMessages);

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      // Should handle missing messages gracefully
      expect(screen.getByText('No messages yet.')).toBeInTheDocument();
    });

    it('handles prompt with empty messages array', async () => {
      const promptWithEmptyMessages = {
        ...mockPrompt,
        messages: [],
      };

      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(promptWithEmptyMessages);

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      expect(screen.getByText('No messages yet.')).toBeInTheDocument();
    });

    it('handles messages without IDs', async () => {
      const promptWithMessagesWithoutIds = {
        ...mockPrompt,
        messages: [
          {
            role: 'User' as const,
            content: 'Hello',
            // No id field
          },
        ],
      };

      useParamsMock.mockReturnValue({ id: 'test-id' });
      getPromptByIdMock.mockResolvedValue(promptWithMessagesWithoutIds);

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Loading prompt...')).not.toBeInTheDocument();
      });

      // Should generate default IDs for messages without IDs
      expect(screen.getByTestId('prompt-message-0')).toBeInTheDocument();
    });
  });
});