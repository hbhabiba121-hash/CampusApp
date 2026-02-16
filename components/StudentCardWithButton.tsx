import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

type StudentCardProps = {
  id: number;
  name: string;
  email: string;
  role: string;
  onDelete: (id: number) => void;
};

export default function StudentCardWithButton({ id, name, email, role, onDelete }: StudentCardProps) {
  const handlePress = () => {
    router.push(`/users/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vraiment supprimer ${name} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete(id),
        },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.7}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  role: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteText: {
    color: '#fff',
    fontSize: 20,
  },
});