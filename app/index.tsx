import { Redirect } from 'expo-router';

import { FullScreenLoader } from '@/components/ui/full-screen-loader';
import { useAuth } from '@/hooks/use-auth';

export default function IndexScreen() {
  const { token, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <FullScreenLoader label="Preparando tu experiencia" />;
  }

  return <Redirect href={token ? '/(tabs)' : '/login'} />;
}
