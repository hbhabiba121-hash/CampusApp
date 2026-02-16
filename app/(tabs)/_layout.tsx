import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Text>🏠</Text>
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profil',
          tabBarIcon: ({ color }) => <Text>👤</Text>
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <Text>⚙️</Text>
        }} 
      />
    </Tabs>
  );
}