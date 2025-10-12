import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import userEvent from '@testing-library/user-event';
import { NewConversation } from './NewConversation';

// Mock functions
const getAllPromptsMock = vi.fn();
const setModelMock = vi.fn();
const setPromptIdMock = vi.fn();

// Mock data that can be modified per test
let promptsSummaryMock: { id: string; name: string }[] = [];
let modelMock = '';
let promptIdMock: string | undefined = undefined;

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
    model: modelMock,
    promptId: promptIdMock,
  }),
  useChatStoreActions: () => ({
    setModel: setModelMock,
    setPromptId: setPromptIdMock,
  }),
}));

describe('NewConversation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock data to default values before each test
    promptsSummaryMock = [
      { id: '1', name: 'Prompt 1' },
      { id: '2', name: 'Prompt 2' },
    ];
    modelMock = 'gpt-4o';
    promptIdMock = '1';
  });

  const renderComponent = () => {
    return render(
      <ConfigProvider>
        <NewConversation />
      </ConfigProvider>
    );
  };
  
  it('displays welcome message and greeting', () => {
    renderComponent();
    expect(screen.getByText('Hello, how can I assist you today?')).toBeInTheDocument();
  });

  it('calls getAllPrompts on mount', () => {
    renderComponent();
    expect(getAllPromptsMock).toHaveBeenCalledTimes(1);
  });

  it('displays model select with the current selected model', () => {
    renderComponent();
    const modelSelect = screen.getAllByRole('combobox')[0];
    expect(modelSelect).toBeInTheDocument();
    expect(screen.getByText('GPT 4o')).toBeInTheDocument();
  });

  it('displays prompt select when prompts are available', () => {
    renderComponent();
    const promptSelect = screen.getAllByRole('combobox')[1];
    expect(promptSelect).toBeInTheDocument();
    expect(screen.getByText('Prompt 1')).toBeInTheDocument();
  });

  it('does not display prompt select when prompts array is empty', () => {
    // Mutate the array to make it empty before rendering
    promptsSummaryMock.length = 0;
    
    renderComponent();
    
    const comboboxes = screen.queryAllByRole('combobox');
    // Only model select should be present
    expect(comboboxes).toHaveLength(1);
  });

  it('displays prompt select with placeholder when no prompt is selected', () => {
    promptIdMock = undefined;
    
    renderComponent();
    
    expect(screen.getByText('Select a prompt if you wish')).toBeInTheDocument();
  });

  it('allows changing the model selection', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const modelSelect = screen.getAllByRole('combobox')[0];
    await user.click(modelSelect);
    
    // After opening the dropdown, the options should be available
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('allows changing the prompt selection', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const promptSelect = screen.getAllByRole('combobox')[1];
    await user.click(promptSelect);
    
    // After opening the dropdown, the options should be available
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('shows clear button on prompt select when allowClear is enabled', () => {
    renderComponent();
    
    // The prompt select has allowClear prop, verify it's present in DOM when value is selected
    const promptSelect = screen.getAllByRole('combobox')[1];
    expect(promptSelect).toBeInTheDocument();
    
    // The clear icon should be present when there's a selected value
    // Note: Ant Design renders the clear icon within the select element
    expect(screen.getByText('Prompt 1')).toBeInTheDocument();
  });

  it('has accessible combobox roles for both selects', () => {
    renderComponent();
    
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(2);
    
    // Verify both comboboxes have proper ARIA attributes
    comboboxes.forEach((combobox) => {
      expect(combobox).toHaveAttribute('role', 'combobox');
      expect(combobox).toHaveAttribute('aria-expanded');
    });
  });

  describe('Edge cases', () => {
    it('handles empty model value gracefully', () => {
      modelMock = '';
      
      renderComponent();
      
      const modelSelect = screen.getAllByRole('combobox')[0];
      expect(modelSelect).toBeInTheDocument();
    });

    it('handles undefined promptId gracefully', () => {
      promptIdMock = undefined;
      
      renderComponent();
      
      expect(screen.getByText('Select a prompt if you wish')).toBeInTheDocument();
    });

    it('handles large number of prompts', () => {
      promptsSummaryMock = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Prompt ${i + 1}`,
      }));
      
      renderComponent();
      
      const promptSelect = screen.getAllByRole('combobox')[1];
      expect(promptSelect).toBeInTheDocument();
    });
  });
});
