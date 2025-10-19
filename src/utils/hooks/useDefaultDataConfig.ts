import { useState } from 'react';

interface DataConfig {
  limit: number;
  page: number;
  direction?: 'asc' | 'desc';
  sort?: string;
  [key: string]: string | number | undefined;
}
function useDefaultDataConfig(additionalConfig: { [key: string]: number | string | undefined } = {}): {
  dataConfig: DataConfig;
  setDataConfig: React.Dispatch<React.SetStateAction<DataConfig>>;
} {
  const [dataConfig, setDataConfig] = useState<DataConfig>({
    limit: 10,
    page: 0,
    direction: 'desc',
    sort: 'created_at',
    ...additionalConfig,
  });

  return { dataConfig, setDataConfig };
}

export type { DataConfig };
export { useDefaultDataConfig };
