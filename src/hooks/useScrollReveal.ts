import { useInView } from 'react-intersection-observer';

/**
 * Custom hook to detect when an element enters the viewport.
 * Uses Intersection Observer internally and triggers only once.
 * 
 * @param {number} threshold - Percentage of the element that needs to be visible to trigger (0.0 to 1.0).
 * @returns {Object} An object containing the ref to attach to the element and the visibility state.
 * @returns {Function} ref - The React ref function to be attached to the target element.
 * @returns {boolean} isVisible - True if the element has entered the viewport.
 */
export const useScrollReveal = (threshold = 0.15) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return { ref, isVisible: inView };
};
