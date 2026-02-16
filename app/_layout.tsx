import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ title: 'À propos' }} 
      />
      <Stack.Screen 
        name="users/[id]" 
        options={{ title: 'Détail utilisateur' }} 
      />
    </Stack>
  );
}