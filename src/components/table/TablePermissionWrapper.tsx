import Can from '../gate/Can';

const PermissionWrapper: React.FC<{ perform: string; children: React.ReactNode; resourceName?: string }> = ({
  perform,
  children,
  resourceName,
}) => {
  // Jika resourceName diberikan, bungkus dengan <Can>
  if (resourceName) {
    return <Can perform={perform}>{children}</Can>;
  }
  // Jika tidak, langsung render tombolnya
  return <>{children}</>;
};

export default PermissionWrapper;
