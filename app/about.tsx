import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function About() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'À propos' }} />
      <Text style={styles.title}>À propos de CampusApp</Text>
      <Text style={styles.content}>
        Cette application a été créée dans le cadre dun TP sur Expo Router.
        Elle démontre lutilisation de :
        {'\n\n'}• Stack Navigation
        {'\n'}• Tabs Navigation
        {'\n'}• Routes dynamiques
        {'\n'}• File-based routing
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});