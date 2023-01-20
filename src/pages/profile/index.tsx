import { memo } from 'react';
import { useRouter } from 'next/router';
import { NotFound } from '../../components/not-found/not-found.component';
import { Profile } from '../../components/profile/profile.component';
import { getEnvVariables } from '../../utils/env.utils';

const ProfilePage = memo(() => {
  const {
    query: { id },
  } = useRouter();

  return typeof id === 'string' ? <Profile id={id} isLite={getEnvVariables().isLite} /> : <NotFound />;
});

export default ProfilePage;
