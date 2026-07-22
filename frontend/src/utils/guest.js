// utils/guest.js

const GUEST_ID_KEY = 'guestId';
const GUEST_LINKED_KEY = 'guestLinked';

export function getGuestId() {
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
}

export function isGuestLinked() {
  return localStorage.getItem(GUEST_LINKED_KEY) === 'true';
}

export function markGuestLinked() {
  localStorage.setItem(GUEST_LINKED_KEY, 'true');
}

export function clearGuest() {
  localStorage.removeItem(GUEST_ID_KEY);
  localStorage.removeItem(GUEST_LINKED_KEY);
}
