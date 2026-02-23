import { View, Text, Button, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import StudentCard from '../../components/StudentCard';  // Chemin corrigé
import AddStudentForm from '../../components/AddStudentForm';  // Chemin corrigé
import EditStudentForm from '../../components/EditStudentForm';  // Chemin corrigé
import database, { Student } from '../../services/database';  // Chemin corrigé

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Charger les étudiants au démarrage
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      await database.init();
      const loadedStudents = await database.getAllStudents();
      setStudents(loadedStudents);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet étudiant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await database.deleteStudent(id);
              if (success) {
                setStudents(prevStudents => 
                  prevStudents.filter(student => student.id !== id)
                );
                Alert.alert('Succès', 'Étudiant supprimé avec succès');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Une erreur est survenue');
            }
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

  const handleSaveEdit = async (id: number, updatedData: { name: string; email: string }) => {
    try {
      const success = await database.updateStudent(id, updatedData);
      if (success) {
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.id === id
              ? { ...student, ...updatedData }
              : student
          )
        );
        Alert.alert('Succès', 'Étudiant modifié avec succès');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const handleAdd = async (newStudent: { name: string; email: string }) => {
    try {
      const added = await database.addStudent({
        ...newStudent,
        role: 'Étudiant'
      });
      
      if (added) {
        setStudents(prevStudents => [...prevStudents, added]);
        Alert.alert('Succès', 'Étudiant ajouté avec succès');
      }
    } catch (error: any) {
      if (error.message?.includes('UNIQUE constraint failed')) {
        Alert.alert('Erreur', 'Cet email existe déjà');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des étudiants...</Text>
      </View>
    );
  }

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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyList}>Aucun étudiant</Text>
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.emptyAddButtonText}>Ajouter un premier étudiant</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyList: {
    fontSize: 16,
    color: '#999',
    marginBottom: 15,
  },
  emptyAddButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});