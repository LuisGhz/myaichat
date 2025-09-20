/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';

// Mock icons as simple components
vi.mock('icons/FavoriteFilledIcon', () => ({ FavoriteFilledIcon: (props: Record<string, unknown>) => <svg data-testid="fav-filled" {...props as any} /> }));
vi.mock('icons/FavoriteIcon', () => ({ FavoriteIcon: (props: Record<string, unknown>) => <svg data-testid="fav" {...props as any} /> }));

// Mock react-router Link
vi.mock('react-router', () => ({ Link: ({ children, to, ...rest }: Record<string, unknown>) => <a href={String((to as any) ?? '#')} {...(rest as any)}>{children}</a> }));

// Mock hooks
const toggleFavoriteMock = vi.fn();
vi.mock('core/hooks/useSideNav', () => ({ useSideNav: () => ({ toggleFavorite: toggleFavoriteMock }) }));

let paramsMock: { id?: string } = { id: '1' };
vi.mock('features/Chat/hooks/useChatParams', () => ({ useChatParams: () => paramsMock }));

import { ChatItem } from './ChatItem';

describe('ChatItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    paramsMock = { id: '1' };
  });

  it('renders title and favorite icon when chat has title and not favorite', () => {
    const chat = { id: '2', title: 'Hello', fav: false } as ChatSummary;
    render(<ChatItem chat={chat} onContextMenu={() => () => {}} />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('fav')).toBeInTheDocument();
  });

  it('renders filled favorite icon when chat is favorite and toggles on click', async () => {
    const chat = { id: '2', title: 'FavChat', fav: true } as ChatSummary;
    render(<ChatItem chat={chat} onContextMenu={() => () => {}} />);

    const btn = screen.getByRole('button', { name: /unfavorite|mark as unfavorite/i });
    expect(screen.getByTestId('fav-filled')).toBeInTheDocument();

    await fireEvent.click(btn);
    expect(toggleFavoriteMock).toHaveBeenCalledWith('2');
  });

  it('calls onContextMenu callback when right-clicked', () => {
    const chat = { id: '3', title: 'Ctx', fav: false } as ChatSummary;
    const onContext = vi.fn().mockImplementation(() => (e: Event) => e.preventDefault());
    render(<ChatItem chat={chat} onContextMenu={onContext} />);

    const li = screen.getByText('Ctx').closest('li') as HTMLElement;
    fireEvent.contextMenu(li);
    expect(onContext).toHaveBeenCalledWith('3');
  });

  it('applies active styling when params.id matches chat id', () => {
    paramsMock = { id: '2' };
    const chat = { id: '2', title: 'Active', fav: false } as ChatSummary;
    render(<ChatItem chat={chat} onContextMenu={() => () => {}} />);

    const link = screen.getByText('Active');
    expect(link).toHaveClass('font-semibold');
  });

  it('renders no title case (justify-end) when title is empty', () => {
    const chat = { id: '4', title: '', fav: false } as ChatSummary;
    const { container } = render(<ChatItem chat={chat} onContextMenu={() => () => {}} />);

    const li = container.querySelector('li') as HTMLElement;
    expect(li.className).toMatch(/justify-end/);
  });
});
