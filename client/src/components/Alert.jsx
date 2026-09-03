
const Alert = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '15px 40px 15px 15px',
      borderRadius: '4px',
      border: '1px solid #f5c6cb',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      {/* Message */}
      <span>{message}</span>

      {/* Close button on top-right */}
      <button 
        onClick={onClose} 
        style={{
          position: 'absolute',
          top: '5px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#721c24',
          fontWeight: 'bold'
        }}
      >
        &times;
      </button>
    </div>
  );
}

export default Alert;
