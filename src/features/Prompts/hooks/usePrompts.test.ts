import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrompts } from './usePrompts';
import * as PromptsService from '../services/PromptsService';

// Mock the PromptsService
vi.mock('../services/PromptsService');

const mockedService = vi.mocked(PromptsService);

describe('usePrompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPromptsResponse = {
    prompts: [
      {
        id: '1',
        name: 'Test Prompt 1',
      },
      {
        id: '2',
        name: 'Test Prompt 2',
      }
    ]
  };

  const mockPrompt = {
    id: '1',
    name: 'Test Prompt 1',
    content: 'Test Content 1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    messages: [{ role: 'User' as const, content: 'Test content 1' }]
  };

  describe('getAllPrompts', () => {
    it('should fetch and update prompts summary successfully', async () => {
      mockedService.GetAllPromptsService.mockResolvedValue(mockPromptsResponse);

      const { result } = renderHook(() => usePrompts());

      await act(async () => {
        await result.current.getAllPrompts();
      });

      expect(mockedService.GetAllPromptsService).toHaveBeenCalledOnce();
      expect(result.current.promptsSummary).toEqual(mockPromptsResponse.prompts);
    });

    it('should handle service errors gracefully', async () => {
      const errorMessage = 'Failed to fetch prompts';
      mockedService.GetAllPromptsService.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => usePrompts());

      await expect(async () => {
        await act(async () => {
          await result.current.getAllPrompts();
        });
      }).rejects.toThrow(errorMessage);

      expect(mockedService.GetAllPromptsService).toHaveBeenCalledOnce();
    });

    it('should handle undefined response', async () => {
      mockedService.GetAllPromptsService.mockResolvedValue({ prompts: [] });

      const { result } = renderHook(() => usePrompts());

      await act(async () => {
        await result.current.getAllPrompts();
      });

      expect(mockedService.GetAllPromptsService).toHaveBeenCalledOnce();
      expect(result.current.promptsSummary).toEqual([]);
    });

    it('should maintain stable reference across re-renders', () => {
      const { result, rerender } = renderHook(() => usePrompts());

      const firstGetAllPrompts = result.current.getAllPrompts;
      rerender();
      const secondGetAllPrompts = result.current.getAllPrompts;

      expect(firstGetAllPrompts).toBe(secondGetAllPrompts);
    });
  });

  describe('getPromptById', () => {
    it('should fetch and return a specific prompt by ID', async () => {
      mockedService.getPromptByIdService.mockResolvedValue(mockPrompt);

      const { result } = renderHook(() => usePrompts());

      let fetchedPrompt;
      await act(async () => {
        fetchedPrompt = await result.current.getPromptById('1');
      });

      expect(fetchedPrompt).toEqual(mockPrompt);
      expect(mockedService.getPromptByIdService).toHaveBeenCalledWith('1');
    });

    it('should handle non-existent prompt ID', async () => {
      mockedService.getPromptByIdService.mockRejectedValue(new Error('Prompt not found'));

      const { result } = renderHook(() => usePrompts());

      await expect(async () => {
        await act(async () => {
          await result.current.getPromptById('999');
        });
      }).rejects.toThrow('Prompt not found');

      expect(mockedService.getPromptByIdService).toHaveBeenCalledWith('999');
    });

    it('should maintain stable reference across re-renders', () => {
      const { result, rerender } = renderHook(() => usePrompts());

      const firstGetPromptById = result.current.getPromptById;
      rerender();
      const secondGetPromptById = result.current.getPromptById;

      expect(firstGetPromptById).toBe(secondGetPromptById);
    });
  });

  describe('deletePrompt', () => {
    it('should optimistically remove prompt from state and call service', async () => {
      mockedService.deletePromptService.mockResolvedValue(undefined);
      mockedService.GetAllPromptsService.mockResolvedValue(mockPromptsResponse);

      const { result } = renderHook(() => usePrompts());

      // First populate the prompts
      await act(async () => {
        await result.current.getAllPrompts();
      });

      expect(result.current.promptsSummary).toHaveLength(2);

      // Then delete one
      await act(async () => {
        await result.current.deletePrompt('1');
      });

      expect(mockedService.deletePromptService).toHaveBeenCalledWith('1');
      expect(result.current.promptsSummary).toHaveLength(1);
      expect(result.current.promptsSummary[0].id).toBe('2');
    });

    it('should restore state when deletion fails', async () => {
      mockedService.deletePromptService.mockRejectedValue(new Error('Failed to delete'));
      mockedService.GetAllPromptsService.mockResolvedValue(mockPromptsResponse);

      const { result } = renderHook(() => usePrompts());

      // First populate the prompts
      await act(async () => {
        await result.current.getAllPrompts();
      });

      expect(result.current.promptsSummary).toHaveLength(2);

      // Then try to delete one (should fail)
      await act(async () => {
        await result.current.deletePrompt('1');
      });

      expect(mockedService.deletePromptService).toHaveBeenCalledWith('1');
      // State should be restored since deletion failed
      expect(result.current.promptsSummary).toHaveLength(2);
    });
  });

  describe('deletePromptMessage', () => {
    it('should call service with correct parameters', async () => {
      mockedService.deletePromptMessageService.mockResolvedValue(undefined);

      const { result } = renderHook(() => usePrompts());

      await act(async () => {
        await result.current.deletePromptMessage('prompt-1', 'message-1');
      });

      expect(mockedService.deletePromptMessageService).toHaveBeenCalledWith('prompt-1', 'message-1');
    });

    it('should handle service errors gracefully', async () => {
      mockedService.deletePromptMessageService.mockRejectedValue(new Error('Failed to delete message'));

      const { result } = renderHook(() => usePrompts());

      // Should not throw, just log error
      await act(async () => {
        await result.current.deletePromptMessage('prompt-1', 'message-1');
      });

      expect(mockedService.deletePromptMessageService).toHaveBeenCalledWith('prompt-1', 'message-1');
    });
  });

  describe('hook stability', () => {
    it('should provide all expected properties', () => {
      const { result } = renderHook(() => usePrompts());

      expect(result.current).toHaveProperty('getAllPrompts');
      expect(result.current).toHaveProperty('getPromptById');
      expect(result.current).toHaveProperty('deletePrompt');
      expect(result.current).toHaveProperty('deletePromptMessage');
      expect(result.current).toHaveProperty('promptsSummary');

      expect(typeof result.current.getAllPrompts).toBe('function');
      expect(typeof result.current.getPromptById).toBe('function');
      expect(typeof result.current.deletePrompt).toBe('function');
      expect(typeof result.current.deletePromptMessage).toBe('function');
      expect(Array.isArray(result.current.promptsSummary)).toBe(true);
    });
  });
});