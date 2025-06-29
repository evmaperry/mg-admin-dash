'use client';

import { usePathname } from 'next/navigation';

const NavPathIndicator: React.FC<{}> = ({}) => {
  const fullPath = usePathname();
  const noSlash = fullPath.slice(1);
  const path = noSlash.slice(
    0,
    noSlash.indexOf('/') !== -1 ? noSlash.indexOf('/') + 1 : undefined
  );

  return (
    <div className={'font-light'}>
      {path === 'create' ? 'App Builder' : 'App Dashboard'}
    </div>
  );
};

export default NavPathIndicator;
