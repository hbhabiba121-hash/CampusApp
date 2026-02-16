import { View, Text, StyleSheet } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.profileCard}>
        <Text style={styles.emoji}>👤</Text>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@campus.com</Text>
        <Text style={styles.role}>Étudiant en Informatique</Text>
      </View>
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
  profileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  role: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});