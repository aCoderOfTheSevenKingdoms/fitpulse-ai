import toast from 'react-hot-toast';

// ─── Shared Base Style ───────────────────────────────────────────────
const base = {
  borderRadius: '10px',
  padding: '12px 20px',
  fontWeight: '500',
  fontSize: '14px',
  color: '#ffffff',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

// ─── Success Toast ────────────────────────────────────────────────────
export const showSuccess = (message) =>
  toast.success(message, {
    duration: 3000,
    style: {
      ...base,
      background: 'radial-gradient(ellipse at center, #000000 45%, #14532d 100%)',
      border: '1px solid #16a34a',
    },
    iconTheme: {
      primary: '#22c55e',   // green icon
      secondary: '#000000', // black icon background
    },
});

// ─── Error Toast ──────────────────────────────────────────────────────
export const showError = (message) =>
  toast.error(message, {
    duration: 3000,
    style: {
      ...base,
      background: 'radial-gradient(ellipse at center, #000000 45%, #7f1d1d 100%)',
      border: '1px solid #dc2626',
    },
    iconTheme: {
      primary: '#ef4444',   // red icon
      secondary: '#000000', // black icon background
    },
});

// ─── Promise Toast ────────────────────────────────────────────────────
const promiseStyle = {
  ...base,
  background: '#141a2e',
  border: '1px solid #1e2a45',
  color: '#e2e8f0',
};

export const showPromise = (promise, { loading, success, error }) =>
  toast.promise(promise, {
    loading,
    success,
    error,
  }, {
    duration: 4000,           // applies to success/error resolution
    style: promiseStyle,
    iconTheme: {
      primary: '#00d4d4',     // cyan-teal spinner/icon
      secondary: '#0d1117',   // deep navy background
    },
    success: {
      style: promiseStyle,
      iconTheme: { primary: '#00d4d4', secondary: '#0d1117' },
    },
    error: {
      style: promiseStyle,
      iconTheme: { primary: '#00d4d4', secondary: '#0d1117' },
    },
});

// Custom message notification -------------------------------------------------

export const showInfo = (message) => 
  toast(message, {
    duration: 3000,
    style: {
      ...base,
      background: 'radial-gradient(ellipse at center, #000000 45%, #141a2e 100%)',
      border: '1px solid #1e2a45',
      color: '#e2e8f0'
    }
});