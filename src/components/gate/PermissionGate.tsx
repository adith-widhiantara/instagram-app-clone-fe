// src/components/ProtectedRoute.tsx

import Unauthorized from '@/pages/others/unauthorized/Unauthorized';
import { usePermissionStore } from '@/stores/permission.store';

type Operator = 'AND' | 'OR';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: string | string[]; // Props bisa string atau array
  operator?: Operator; // Props operator opsional
}

const PermissionGate: React.FC<ProtectedRouteProps> = ({ children, requiredPermission, operator }) => {
  const can = usePermissionStore(state => state.can);

  if (!can(requiredPermission, operator)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default PermissionGate;
