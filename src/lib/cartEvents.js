// src/utils/cartEvents.js
export const updateCartEvent = new Event('cartUpdated');

export const triggerCartUpdate = () => {
  window.dispatchEvent(updateCartEvent);
};