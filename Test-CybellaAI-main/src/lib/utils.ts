
/**
 * Conditionally join classNames.
 * Common in Tailwind/React projects.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(' ');
  }
  