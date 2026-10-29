'use client';

import { useAuth } from '@/hooks/apiHooks/auth/useAuth';
import { ConfirmDialog } from '@/components/primitives';

interface LogoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const Logout: React.FC<LogoutProps> = ({
  isOpen = false,
  onClose,
}) => {
  const { logout } = useAuth();

  return (
    <ConfirmDialog
      open={isOpen}
      onClose={onClose}
      onConfirm={() => logout()}
      title="Log out?"
      description="You will need to sign in again to continue working."
      confirmLabel="Log out"
      tone="danger"
    />
  );
};

export default Logout;
