import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import AvatarSelector from './AvatarSelector';

type AddStudentFormProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (student: { name: string; email: string; avatar?: any }) => void;
};

export default function AddStudentForm({ visible, onClose, onAdd }: AddStudentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<any>({ emoji: '👤', color: '#007AFF' });
  const [avatarSelectorVisible, setAvatarSelectorVisible] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }

    onAdd({
      name: name.trim(),
      email: email.trim(),
      avatar,
    });

    setName('');
    setEmail('');
    setAvatar({ emoji: '👤', color: '#007AFF' });
    onClose();
  };

  const getAvatarDisplay = () => {
    if (typeof avatar === 'string') {
      return <Image source={{ uri: avatar }} style={styles.avatarPreview} />;
    } else {
      return (
        <View style={[styles.avatarPreview, { backgroundColor: avatar.color }]}>
          <Text style={styles.avatarPreviewEmoji}>{avatar.emoji}</Text>
        </View>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Ajouter un étudiant</Text>

          {/* Avatar preview */}
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => setAvatarSelectorVisible(true)}
          >
            {getAvatarDisplay()}
            <Text style={styles.changeAvatarText}>Changer lavatar</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Entrez le nom"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="exemple@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <AvatarSelector
        visible={avatarSelectorVisible}
        onClose={() => setAvatarSelectorVisible(false)}
        onSelectAvatar={setAvatar}
        currentAvatar={avatar}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatarPreviewEmoji: {
    fontSize: 40,
  },
  changeAvatarText: {
    color: '#007AFF',
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#28a745',
    marginLeft: 10,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});