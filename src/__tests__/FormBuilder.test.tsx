import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormPreview } from '../components/FormBuilder/FormPreview';
import { ComponentPalette } from '../components/FormBuilder/ComponentPalette';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndProvider backend={HTML5Backend}>{children}</DndProvider>
);

describe('FormBuilder Components', () => {
  it('renders ComponentPalette with all default components', () => {
    render(
      <TestWrapper>
        <ComponentPalette />
      </TestWrapper>
    );
    
    expect(screen.getByText('Text Input')).toBeInTheDocument();
    expect(screen.getByText('Email Input')).toBeInTheDocument();
    expect(screen.getByText('Number Input')).toBeInTheDocument();
  });

  it('renders FormPreview with components', () => {
    const mockComponents = [
      {
        id: 'test-1',
        type: 'text',
        label: 'Test Input',
        placeholder: 'Enter test...',
        required: false,
      },
    ];

    const mockRemove = vi.fn();
    const mockUpdate = vi.fn();

    render(
      <FormPreview
        components={mockComponents}
        onRemove={mockRemove}
        onUpdate={mockUpdate}
      />
    );

    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter test...')).toBeInTheDocument();
  });

  it('handles component removal', () => {
    const mockComponents = [
      {
        id: 'test-1',
        type: 'text',
        label: 'Test Input',
        placeholder: 'Enter test...',
        required: false,
      },
    ];

    const mockRemove = vi.fn();
    const mockUpdate = vi.fn();

    render(
      <FormPreview
        components={mockComponents}
        onRemove={mockRemove}
        onUpdate={mockUpdate}
      />
    );

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith('test-1');
  });
});