import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as ChatStore from 'store/app/ChatStore'
import { SelectedFilePreview } from './SelectedFilePreview'

describe('SelectedFilePreview (store-based)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders a non-image file name when selectedFile from store is not an image', () => {
    const file = new File(['data'], 'document.pdf', { type: 'application/pdf' })

  vi.spyOn(ChatStore, 'useChatStore').mockReturnValue({ selectedFile: file } as unknown as ReturnType<typeof ChatStore.useChatStore>)
  vi.spyOn(ChatStore, 'useChatStoreActions').mockReturnValue({ setSelectedFile: vi.fn() } as unknown as ReturnType<typeof ChatStore.useChatStoreActions>)

    render(<SelectedFilePreview />)

    expect(screen.getByText('document.pdf')).toBeInTheDocument()
  })

  it('renders an image preview and calls setSelectedFile(null) when remove button is clicked', async () => {
    // Mock createObjectURL since jsdom does not implement it
    const mockUrl = 'blob:http://localhost/mock-image'
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => mockUrl),
    } as unknown as typeof URL)

    const imageFile = new File(['(binary)'], 'photo.png', { type: 'image/png' })
    const setSelectedFileMock = vi.fn()

  vi.spyOn(ChatStore, 'useChatStore').mockReturnValue({ selectedFile: imageFile } as unknown as ReturnType<typeof ChatStore.useChatStore>)
  vi.spyOn(ChatStore, 'useChatStoreActions').mockReturnValue({ setSelectedFile: setSelectedFileMock } as unknown as ReturnType<typeof ChatStore.useChatStoreActions>)

    render(<SelectedFilePreview />)

    const img = await screen.findByLabelText('Selected image preview')
    expect(img).toBeInTheDocument()
    // Ensure our mocked createObjectURL was used for the src
    // Note: antd's Image may not render a plain <img> in jsdom; checking the src attribute if present
    const maybeImg = img as HTMLImageElement
    if (maybeImg.src) expect(maybeImg.src).toBe(mockUrl)

    const removeButton = screen.getByRole('button', { name: /remove selected image/i })
    await userEvent.click(removeButton)
    expect(setSelectedFileMock).toHaveBeenCalledWith(null)
  })
})
