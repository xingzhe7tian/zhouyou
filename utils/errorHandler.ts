export function setupGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Uncaught error:', { message, source, lineno, colno, error: error?.toString() });
      // You can add additional error reporting logic here, such as sending to a logging service
      return false;
    };
  }
}

