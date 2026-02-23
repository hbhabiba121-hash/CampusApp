import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Modal,
  StatusBar,
  RefreshControl
} from 'react-native';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import database, { Student } from '../../services/database';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Couleurs du thème
  const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    background: '#f9fafb',
    card: '#ffffff',
    text: '#1f2937',
    textLight: '#6b7280',
    border: '#e5e7eb'
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      await database.init();
      const data = await database.getAllStudents();
      setStudents(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les étudiants');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudents();
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: '', email: '' });
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({ name: student.name, email: student.email });
    setEditModalVisible(true);
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
            await database.deleteStudent(id);
            await loadStudents();
          }
        },
      ]
    );
  };

  const saveStudent = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      if (editModalVisible && selectedStudent) {
        await database.updateStudent(selectedStudent.id, { ...formData, role: 'Étudiant' });
      } else {
        await database.addStudent({ ...formData, role: 'Étudiant' });
      }
      await loadStudents();
      setModalVisible(false);
      setEditModalVisible(false);
    } catch {
      Alert.alert('Erreur', 'Cet email existe déjà');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Chargement de CampusApp...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header avec gradient */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>CampusApp</Text>
          <Text style={styles.headerSubtitle}>
            {students.length} étudiant{students.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </LinearGradient>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un étudiant..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Liste des étudiants */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.studentCard, { backgroundColor: colors.card }]}>
            <View style={styles.studentAvatar}>
              <Text style={styles.avatarText}>
                {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.studentEmail}>{item.email}</Text>
              <View style={styles.studentRole}>
                <Ionicons name="school-outline" size={14} color={colors.primary} />
                <Text style={styles.roleText}>{item.role}</Text>
              </View>
            </View>
            <View style={styles.studentActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Ionicons name="pencil" size={18} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color={colors.textLight} />
            <Text style={styles.emptyTitle}>Aucun étudiant</Text>
            <Text style={styles.emptyText}>
              Commencez par ajouter des étudiants à la liste
            </Text>
          </View>
        }
      />

      {/* Bouton flottant d'ajout */}
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal d'ajout/modification */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible || editModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editModalVisible ? 'Modifier' : 'Ajouter'} un étudiant
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditModalVisible(false);
                }}
              >
                <Ionicons name="close" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom complet</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border }]}
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border }]}
                  placeholder="jean@campus.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveStudent}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {editModalVisible ? 'Mettre à jour' : 'Ajouter'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Lien "À propos" */}
      <Link href="/about" asChild>
        <TouchableOpacity style={styles.aboutButton}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.aboutText, { color: colors.primary }]}>À propos</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
  header: {
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#1f2937',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  studentRole: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    color: '#6366f1',
    marginLeft: 4,
  },
  studentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  aboutText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalBody: {
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});