import NavigationWrapper from '@/components/navigation/NavigationWrapper';
import navigationData from '@/utils/constants/navigationdata';

export default function Navigation() {
  const { main, shortcuts } = navigationData;
  return <NavigationWrapper mainNavItems={main} shortcutItems={shortcuts} />;
}
