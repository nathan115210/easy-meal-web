import NavigationWrapper from '@/components/navigation/NavigationWrapper';

export default async function Navigation() {
  const navigation = await fetch('http://localhost:3000/api/navigationData');
  const { main, shortcuts } = await navigation.json();
  return <NavigationWrapper mainNavItems={main} shortcutItems={shortcuts} />;
}
