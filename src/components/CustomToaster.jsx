import toast, { Toaster } from 'react-hot-toast';

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={16}
      containerClassName="custom-toaster-container"
      containerStyle={{
        top: 24,
        right: 24,
      }}
      toastOptions={{
        // Default options for all toasts - Orange & Black Theme
        duration: 1500,
        className: '',
        style: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b12 50%, #0a0a0a 100%)',
          color: '#fef3e2',
          border: '1px solid rgba(251, 146, 60, 0.25)',
          borderRadius: '5px',
          fontSize: '18px',
          fontWeight: '600',
          padding: '18px 24px',
          minHeight: '7vh',
          boxShadow: `
            0 32px 64px -12px rgba(251, 146, 60, 0.08),
            0 20px 40px -8px rgba(0, 0, 0, 0.4),
            0 8px 16px -4px rgba(251, 146, 60, 0.15),
            0 0 0 1px rgba(251, 146, 60, 0.1) inset,
            0 2px 4px rgba(251, 146, 60, 0.2) inset
          `,
          backdropFilter: 'blur(20px) saturate(180%)',
          maxWidth: '480px',
          wordWrap: 'break-word',
          fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        
        // Success toast - Orange & Black Theme
        success: {
          style: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b12 50%, #0a0a0a 100%)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            color: '#fef3e2',
            boxShadow: `
              0 32px 64px -12px rgba(251, 146, 60, 0.12),
              0 20px 40px -8px rgba(0, 0, 0, 0.4),
              0 8px 16px -4px rgba(251, 146, 60, 0.2),
              0 0 0 1px rgba(251, 146, 60, 0.15) inset,
              0 2px 4px rgba(251, 146, 60, 0.25) inset
            `,
          },
          iconTheme: {
            primary: '#fb923c',
            secondary: '#fef3e2',
          },
          duration: 2500,
        },
        
        // Error toast - Orange & Black Theme
        error: {
          style: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b12 50%, #0a0a0a 100%)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            color: '#fef3e2',
            boxShadow: `
              0 32px 64px -12px rgba(251, 146, 60, 0.12),
              0 20px 40px -8px rgba(0, 0, 0, 0.4),
              0 8px 16px -4px rgba(251, 146, 60, 0.2),
              0 0 0 1px rgba(251, 146, 60, 0.15) inset,
              0 2px 4px rgba(251, 146, 60, 0.25) inset
            `,
          },
          iconTheme: {
            primary: '#ea580c',
            secondary: '#fef3e2',
          },
          duration: 2500,
        },
        
        // Loading toast - Orange & Black Theme
        loading: {
          style: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b12 50%, #0a0a0a 100%)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            color: '#fef3e2',
            boxShadow: `
              0 32px 64px -12px rgba(251, 146, 60, 0.12),
              0 20px 40px -8px rgba(0, 0, 0, 0.4),
              0 8px 16px -4px rgba(251, 146, 60, 0.2),
              0 0 0 1px rgba(251, 146, 60, 0.15) inset,
              0 2px 4px rgba(251, 146, 60, 0.25) inset
            `,
          },
          iconTheme: {
            primary: '#f97316',
            secondary: '#fef3e2',
          },
        },
        
        // Warning/Blank toast - Orange & Black Theme
        blank: {
          style: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b12 50%, #0a0a0a 100%)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            color: '#fef3e2',
            boxShadow: `
              0 32px 64px -12px rgba(251, 146, 60, 0.12),
              0 20px 40px -8px rgba(0, 0, 0, 0.4),
              0 8px 16px -4px rgba(251, 146, 60, 0.2),
              0 0 0 1px rgba(251, 146, 60, 0.15) inset,
              0 2px 4px rgba(251, 146, 60, 0.25) inset
            `,
          },
        },
        
        // Custom toast - Pure Orange Theme
        custom: {
          style: {
            background: 'linear-gradient(135deg, #1f1611 0%, #ea580c 25%, #fb923c 75%, #1a140f 100%)',
            border: '1px solid rgba(251, 146, 60, 0.6)',
            color: '#fed7aa',
            boxShadow: `
              0 32px 64px -12px rgba(251, 146, 60, 0.2),
              0 20px 40px -8px rgba(0, 0, 0, 0.5),
              0 8px 16px -4px rgba(251, 146, 60, 0.35),
              0 0 0 1px rgba(251, 146, 60, 0.25) inset,
              0 4px 8px rgba(251, 146, 60, 0.2) inset
            `,
          },
        },
      }}
    />
  );
};

export default CustomToaster;