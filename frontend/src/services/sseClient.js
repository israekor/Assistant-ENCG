import keycloak from '../auth/keycloak';
import { getGuestId } from '../utils/guest';

export async function streamChat(
  { conversationId, message },
  handlers,
  signal,
) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Guest-Id': getGuestId(),
  };

  if (keycloak.authenticated) {
    await keycloak.updateToken(30);
    headers.Authorization = `Bearer ${keycloak.token}`;
  }

  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers,
    body: JSON.stringify({ conversationId, message }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop();

    for (const rawEvent of events) {
      if (!rawEvent.trim()) continue;

      let eventType = 'message';
      const dataLines = [];

      for (const line of rawEvent.split('\n')) {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trim());
        }
      }

      if (dataLines.length === 0) continue;

      let payload;
      try {
        payload = JSON.parse(dataLines.join('\n'));
      } catch {
        payload = dataLines.join('\n');
      }

      dispatch(eventType, payload, handlers);
    }
  }
}

function dispatch(eventType, payload, handlers) {
  const data = payload?.data ?? payload;

  switch (eventType) {
    case 'conversation':
      handlers.onConversation?.(data);
      break;
    case 'token':
      handlers.onToken?.(data);
      break;
    case 'done':
      handlers.onDone?.(data);
      break;
    case 'error':
      handlers.onError?.(data);
      break;
    default:
      handlers.onUnknown?.(eventType, data);
  }
}
