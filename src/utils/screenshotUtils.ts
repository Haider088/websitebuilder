import html2canvas from 'html2canvas';

/**
 * Capture a screenshot of a specific element
 * @param elementId - The ID of the element to capture
 * @param scale - Scale factor for the screenshot (default 0.5 for smaller file size)
 * @returns Base64-encoded PNG image data URL
 */
export async function captureScreenshot(elementId: string, scale: number = 0.5): Promise<string> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw new Error('Failed to capture screenshot');
  }
}

/**
 * Capture screenshot of the canvas area
 * @returns Base64-encoded PNG image
 */
export async function captureCanvasScreenshot(): Promise<string> {
  // Try to find the canvas element
  const canvasElement = document.querySelector('[data-canvas-area]') as HTMLElement;
  
  if (canvasElement) {
    return captureScreenshot(canvasElement.id || 'canvas-area', 0.5);
  }

  // Fallback to capturing the whole workspace
  const workspace = document.querySelector('.workspace') as HTMLElement;
  if (workspace) {
    return html2canvas(workspace, {
      scale: 0.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    }).then(canvas => canvas.toDataURL('image/png'));
  }

  throw new Error('Could not find canvas or workspace to capture');
}
