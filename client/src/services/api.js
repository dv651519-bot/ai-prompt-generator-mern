/**
 * API Service Client for AI Prompt Generator
 * Supports direct API endpoints with graceful error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function generatePromptApi({ topic, persona, tone, outputFormat }) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, persona, tone, outputFormat }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message ||
      (data.errors && data.errors.map((e) => e.message).join(', ')) ||
      'Failed to generate prompt';
    throw new Error(errorMessage);
  }

  return data.data;
}

export async function savePromptApi(promptPayload) {
  const response = await fetch(`${API_BASE_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptPayload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message ||
      (data.errors && data.errors.map((e) => e.message).join(', ')) ||
      'Failed to save prompt';
    throw new Error(errorMessage);
  }

  return data;
}

export async function fetchHistoryApi() {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch history');
  }

  return data;
}

export async function deleteHistoryApi(id) {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete prompt');
  }

  return data;
}

export async function checkHealthApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}
