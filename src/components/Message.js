import React from 'react';
import { BsJournalText } from 'react-icons/bs';

const NotesInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value); // Invoke the onChange prop with the new value
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '50px', width: '100%', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '0 12px' }}>
      <BsJournalText style={{ position: 'absolute', left: '10px', color: '#6c757d', zIndex: 10 }} />
      <input
        type="message"
        placeholder="Notes"
        value={value}
        onChange={handleInputChange} // Call handleInputChange function on change
        style={{
          paddingLeft: '30px', 
          border: 'none', 
          width: '100%', 
          height: '100%', 
          outline: 'none',
          // Removes the focus outline for accessibility, consider keeping some focus indicator
          boxShadow: 'none',
        }}
        
      />
    </div>
  );
};

export default NotesInput;
