import DOMPurify from 'dompurify';

// Configure DOMPurify
const config = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
    'div', 'span', 'img'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
    'data-*' // Allow data attributes
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ADD_TAGS: ['iframe'], // Allow iframes for video embeds
  ADD_ATTR: ['allowfullscreen', 'frameborder', 'allow'], // Additional iframe attributes
  FORBID_TAGS: ['script', 'style', 'input', 'form', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  SANITIZE_DOM: true,
  KEEP_CONTENT: true
};

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, config);
}

// Sanitize URLs to prevent XSS via javascript: protocol
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol.toLowerCase();
    if (protocol === 'javascript:' || protocol === 'data:' || protocol === 'vbscript:') {
      return '';
    }
    return url;
  } catch {
    return url; // Return as-is if not a valid URL
  }
}

// Sanitize file names to prevent path traversal
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
}