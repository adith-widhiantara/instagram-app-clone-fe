// src/components/Can.tsx

import { usePermissionStore } from '@/stores/permission.store';
import React from 'react';

type Operator = 'AND' | 'OR';

interface CanProps {
  perform: string | string[]; // Props bisa string atau array
  operator?: Operator; // Props operator opsional
  children: React.ReactNode;
}

const Can: React.FC<CanProps> = ({ perform, operator, children }) => {
  const can = usePermissionStore(state => state.can);

  // Teruskan props langsung ke fungsi 'can' yang sudah canggih
  if (can(perform, operator)) {
    return <>{children}</>;
  }

  return null;
};

export default Can;
