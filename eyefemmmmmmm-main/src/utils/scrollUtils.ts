/**
 * Smoothly scrolls the window to the specified target element or position
 * @param target - Can be a CSS selector, HTMLElement, or a number (in pixels)
 * @param options - Scroll options (offset, behavior, etc.)
 */
export const smoothScrollTo = (
  target: string | HTMLElement | number,
  options: {
    offset?: number;
    behavior?: ScrollBehavior;
    container?: HTMLElement | null;
  } = {}
): void => {
  const {
    offset = 0,
    behavior = 'smooth',
    container = document.documentElement,
  } = options;

  const scrollContainer = container || document.documentElement;
  const isWindow = scrollContainer === document.documentElement || scrollContainer === document.body;
  const scrollToOptions: ScrollToOptions = { behavior };

  if (typeof target === 'number') {
    // Scroll to specific position
    scrollToOptions.top = target + offset;
  } else if (typeof target === 'string') {
    // Scroll to element by selector
    const element = document.querySelector(target);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const containerRect = isWindow 
        ? { top: 0, left: 0 } 
        : (scrollContainer as HTMLElement).getBoundingClientRect();
      
      scrollToOptions.top = 
        (isWindow ? window.scrollY : scrollContainer.scrollTop) +
        elementRect.top -
        containerRect.top +
        offset;
    }
  } else if (target instanceof HTMLElement) {
    // Scroll to DOM element
    const elementRect = target.getBoundingClientRect();
    const containerRect = isWindow 
      ? { top: 0, left: 0 } 
      : (scrollContainer as HTMLElement).getBoundingClientRect();
    
    scrollToOptions.top = 
      (isWindow ? window.scrollY : scrollContainer.scrollTop) +
      elementRect.top -
      containerRect.top +
      offset;
  }

  if (isWindow) {
    window.scrollTo(scrollToOptions);
  } else if (scrollContainer) {
    scrollContainer.scrollTo(scrollToOptions);
  }
};

/**
 * Scrolls to the top of the page or a container
 */
export const scrollToTop = (options: {
  behavior?: ScrollBehavior;
  container?: HTMLElement | null;
} = {}) => {
  smoothScrollTo(0, { ...options, offset: 0 });
};

/**
 * Initializes smooth scrolling for all anchor links
 */
export const initSmoothScrolling = (container: Document | HTMLElement = document) => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
    
    if (anchor && anchor.getAttribute('href') !== '#') {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId) {
        smoothScrollTo(targetId, { behavior: 'smooth' });
        // Update URL without adding to history
        if (history.pushState) {
          history.pushState(null, '', targetId);
        } else {
          location.hash = targetId;
        }
      }
    }
  };

  container.addEventListener('click', handleClick);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('click', handleClick);
  };
};
