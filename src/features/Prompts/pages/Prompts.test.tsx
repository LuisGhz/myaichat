import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock react-router's useNavigate and Link like other tests in the repo
const navigateMock = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ children, to, ...rest }: { children?: import('react').ReactNode; to?: unknown } & Record<string, unknown>) => (
      <a href={String(to ?? '#')} {...(rest as Record<string, unknown>)}>
        {children}
      </a>
    ),
  };
});

// Mock the usePrompts hook
const getAllPromptsMock = vi.fn();
const deletePromptMock = vi.fn();
const promptsSummaryMock = [
  { id: 'p1', name: 'First Prompt' },
  { id: 'p2', name: 'Second Prompt' },
];

vi.mock('features/Prompts/hooks/usePrompts', () => ({
  usePrompts: () => ({
    getAllPrompts: getAllPromptsMock,
    deletePrompt: deletePromptMock,
    promptsSummary: promptsSummaryMock,
  }),
}));

// Mock TrashOutlineIcon to simplify queries
vi.mock('icons/TrashOutlineIcon', () => ({ TrashOutlineIcon: () => <span data-testid="trash-icon">del</span> }));

// Use ConfigProvider if the component uses antd internally (many tests wrap with it).
import { ConfigProvider } from 'antd';
import { Prompts } from './Prompts';

function renderComponent() {
  return render(
    <ConfigProvider>
      <Prompts />
    </ConfigProvider>
  );
}

describe('Prompts page', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  it('renders a list of prompts and a create button', async () => {
    renderComponent();

    // getAllPrompts should be called on mount
    expect(getAllPromptsMock).toHaveBeenCalledTimes(1);

    // prompts show up by name
    expect(await screen.findByText('First Prompt')).toBeDefined();
    expect(screen.getByText('Second Prompt')).toBeDefined();

  // Create New Prompt button exists (Antd renders it with role="link")
  expect(screen.getByRole('link', { name: /Create New Prompt/i })).toBeInTheDocument();
  });

  it('navigates to form when Create New Prompt is clicked', async () => {
    renderComponent();
  await user.click(screen.getByRole('link', { name: /Create New Prompt/i }));
    expect(navigateMock).toHaveBeenCalledWith('/prompts/form');
  });

  it('opens confirmation modal when delete icon is clicked and deletes on confirm', async () => {
    renderComponent();

    // click the delete button for first prompt
    const deleteButtons = await screen.findAllByRole('button', { name: /Delete Prompt/i });
    expect(deleteButtons.length).toBeGreaterThan(0);

    await user.click(deleteButtons[0]);

    // Modal should show the message
    expect(await screen.findByText(/Are you sure you want to delete this prompt\?/i)).toBeDefined();

    // Click OK on the modal (Antd renders an OK button)
    const ok = await screen.findByRole('button', { name: /ok/i });
    await user.click(ok);

    await waitFor(() => expect(deletePromptMock).toHaveBeenCalledTimes(1));
  });
});
