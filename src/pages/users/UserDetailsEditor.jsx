import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/useToast';

export const UserDetailsEditor = ({ user, onBack, onSave }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSave({ userId: user.userId, name, email });
    } catch (saveError) {
      showToast(saveError.message || 'Unable to update user. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="wetap-user-details-editor">
      <button
        type="button"
        className="wetap-user-details-back"
        onClick={onBack}
        aria-label="Back to users"
      >
        <ArrowLeft size={22} />
      </button>

      <form className="wetap-user-details-card" onSubmit={handleSubmit}>
        <h2>Fill User Details</h2>
        <div className="wetap-user-details-fields">
          <label className="wetap-user-details-field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isSaving}
            />
          </label>
          <label className="wetap-user-details-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isSaving}
            />
          </label>
        </div>
        <div className="wetap-user-details-submit">
          <button type="submit" className="wetap-gradient-btn" disabled={isSaving}>
            {isSaving ? 'SAVING...' : 'Edit & Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsEditor;
