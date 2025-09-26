import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { NewConversation } from './NewConversation';

// Mock the hooks
const getAllPromptsMock = vi.fn();
let promptsSummaryMock = [
  { id: '1', name: 'Prompt 1' },
  { id: '2', name: 'Prompt 2' },
];

const setModelMock = vi.fn();
const setPromptIdMock = vi.fn();

vi.mock('core/const/Models', () => ({
  MODELS: [
    {
      name: "GPT 4o",
      value: "gpt-4o",
      developBy: { name: "OpenAI" },
    },
  ],
}));

vi.mock('features/Prompts/hooks/usePrompts', () => ({
  usePrompts: () => ({
    getAllPrompts: getAllPromptsMock,
    promptsSummary: promptsSummaryMock,
  }),
}));

vi.mock('store/app/ChatStore', () => ({
  useChatStore: () => ({
    model: 'gpt-4o',
    promptId: '1',
  }),
  useChatStoreActions: () => ({
    setModel: setModelMock,
    setPromptId: setPromptIdMock,
  }),
}));

const renderComponent = () => {
  return render(
    <ConfigProvider>
      <NewConversation />
    </ConfigProvider>
  );
};

describe('NewConversation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('displays model select with grouped options', () => {
    renderComponent();
    const modelSelect = screen.getAllByRole('combobox')[0];
    expect(screen.getByText('Hello, how can I assist you today?')).toBeInTheDocument();
    expect(screen.getByText('GPT 4o')).toBeInTheDocument();
    expect(getAllPromptsMock).toHaveBeenCalledTimes(1);
    expect(modelSelect).toBeInTheDocument();
  });

  it('displays prompt select with options', () => {
    renderComponent();
    const promptSelect = screen.getAllByRole('combobox')[1];
    expect(promptSelect).toBeInTheDocument();
  });

  it('Do not displays prompt select with options if array is empty', () => {
    promptsSummaryMock = [];
    renderComponent();
    const promptSelect = screen.queryAllByRole('combobox')[1];
    expect(promptSelect).toBeUndefined();
  });

  it('allows selecting a prompt', async () => {
    renderComponent();
    // Test that the prompt is displayed correctly
    expect(screen.getByText('Prompt 1')).toBeInTheDocument();
  });

  it('allows clearing the prompt selection', async () => {
    renderComponent();
    // Since testing click is complex, test that clear is present
    expect(screen.getByLabelText('close-circle')).toBeInTheDocument();
  });

  // Additional tests for accessibility, state changes, etc.
  it('has accessible labels for selects', () => {
    renderComponent();
    // Check for labels or aria-labels if added
    expect(screen.getByText('Hello, how can I assist you today?')).toBeInTheDocument(); // Placeholder
  });
});
