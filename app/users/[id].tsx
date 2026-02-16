import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

export default function UserDetail() {
  const { id } = useLocalSearchParams();
  const userId = String(Array.isArray(id) ? id[0] : id);

  const users = {
    '1': { 
      name: 'Alice Martin', 
      email: 'alice@campus.com', 
      role: 'Étudiant',
      avatar: { emoji: '👩', color: '#FF69B4' }
    },
    '2': { 
      name: 'Bob Dupont', 
      email: 'bob@campus.com', 
      role: 'Étudiant',
      avatar: { emoji: '👨', color: '#4CAF50' }
    },
    '3': { 
      name: 'Charlie Lambert', 
      email: 'charlie@campus.com', 
      role: 'Étudiant',
      avatar: { emoji: '🧑', color: '#FFA500' }
    },
  };

  const user = users[userId as keyof typeof users];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Utilisateur non trouvé</Text>
      </View>
    );
  }

  const renderAvatar = () => {
    if (typeof user.avatar === 'string') {
      return <Image source={{ uri: user.avatar }} style={styles.avatar} />;
    } else {
      return (
        <View style={[styles.avatar, { backgroundColor: user.avatar.color }]}>
          <Text style={styles.avatarEmoji}>{user.avatar.emoji}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Profil de ${user.name}` }} />
      
      <View style={styles.profileHeader}>
        {renderAvatar()}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Informations</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID :</Text>
          <Text style={styles.infoValue}>{userId}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nom :</Text>
          <Text style={styles.infoValue}>{user.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email :</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rôle :</Text>
          <Text style={styles.infoValue}>{user.role}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 60,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});