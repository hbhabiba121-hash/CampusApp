import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import StudentCard from '../../components/StudentCard';
import AddStudentForm from '../../components/AddStudentForm';
import EditStudentForm from '../../components/EditStudentForm';

type Student = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | { emoji: string; color: string };  // Nouveau champ
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Alice Martin', email: 'alice@campus.com', role: 'Étudiant' },
    { id: 2, name: 'Bob Dupont', email: 'bob@campus.com', role: 'Étudiant' },
    { id: 3, name: 'Charlie Lambert', email: 'charlie@campus.com', role: 'Étudiant' },
    { id: 4, name: 'Diana Prince', email: 'diana@campus.com', role: 'Étudiant' },
  ]);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet etudiant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setStudents(prevStudents => 
              prevStudents.filter(student => student.id !== id)
            );
          }
        },
      ]
    );
  };

  const handleEdit = (id: number) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setSelectedStudent(student);
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = (id: number, updatedData: { name: string; email: string }) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id
          ? { ...student, ...updatedData }
          : student
      )
    );
  };

  const handleAdd = (newStudent: { name: string; email: string }) => {
    const newId = Math.max(...students.map(s => s.id), 0) + 1;
    setStudents([...students, { 
      id: newId, 
      ...newStudent, 
      role: 'Étudiant' 
    }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CampusApp</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
      
      <Link href="/about" asChild>
        <Button title="À propos" />
      </Link>

      <Text style={styles.subtitle}>Liste des étudiants :</Text>
      <Text style={styles.hint}>← Glissez pour voir les options (Modifier/Supprimer)</Text>
      
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StudentCard
            id={item.id}
            name={item.name}
            email={item.email}
            role={item.role}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyList}>Aucun étudiant</Text>
        }
      />

      <AddStudentForm
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAdd}
      />

      <EditStudentForm
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedStudent(null);
        }}
        onEdit={handleSaveEdit}
        student={selectedStudent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});