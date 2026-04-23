export async function sendChat(message) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
}
