import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SelectedFilePreview } from './SelectedFilePreview'

// Render helper to avoid repetition
const renderComponent = (props?: Partial<React.ComponentProps<typeof SelectedFilePreview>>) => {
  const defaultFile = new File(['hello'], 'hello.txt', { type: 'text/plain' })
  const defaultProps: React.ComponentProps<typeof SelectedFilePreview> = {
    selectedFile: props?.selectedFile ?? defaultFile,
    removeSelectedFile: props?.removeSelectedFile ?? vi.fn(),
  }

  return render(<SelectedFilePreview {...defaultProps} />)
}

describe('SelectedFilePreview', () => {
  beforeEach(() => {
    // reset any URL.createObjectURL mocks between tests
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders a non-image file name when selectedFile is not an image', () => {
    const file = new File(['data'], 'document.pdf', { type: 'application/pdf' })
    renderComponent({ selectedFile: file })

    // Expect the file name to be visible
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
  })

  it('renders an image preview and calls removeSelectedFile when remove button is clicked', async () => {
    // Mock createObjectURL since jsdom does not implement it
    const mockUrl = 'blob:http://localhost/mock-image'
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => mockUrl),
    } as unknown as typeof URL)

    const imageFile = new File(['(binary)'], 'photo.png', { type: 'image/png' })
    const removeMock = vi.fn()

    renderComponent({ selectedFile: imageFile, removeSelectedFile: removeMock })

    // The image should be rendered with the correct alt text / aria-label
    const img = await screen.findByAltText('photo.png')
    expect(img).toBeInTheDocument()
    // Ensure our mocked createObjectURL was used for the src
    expect((img as HTMLImageElement).src).toBe(mockUrl)

    // The remove button should be accessible by aria-label
    const removeButton = screen.getByRole('button', { name: /remove selected image/i })
    await userEvent.click(removeButton)
    expect(removeMock).toHaveBeenCalled()
  })
})
