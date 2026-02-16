import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Avatars par défaut (vous pouvez ajouter vos propres images)
const DEFAULT_AVATARS = [
  { id: 1, emoji: '👤', color: '#007AFF' },
  { id: 2, emoji: '👩', color: '#FF69B4' },
  { id: 3, emoji: '👨', color: '#4CAF50' },
  { id: 4, emoji: '🧑', color: '#FFA500' },
  { id: 5, emoji: '👧', color: '#FF6B6B' },
  { id: 6, emoji: '👦', color: '#4ECDC4' },
  { id: 7, emoji: '👵', color: '#95A5A6' },
  { id: 8, emoji: '👴', color: '#9B59B6' },
];

type AvatarSelectorProps = {
  visible: boolean;
  onClose: () => void;
  onSelectAvatar: (avatar: string | { emoji: string; color: string }) => void;
  currentAvatar?: string;
};

export default function AvatarSelector({ visible, onClose, onSelectAvatar, currentAvatar }: AvatarSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<'default' | 'camera'>('default');

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à votre galerie pour choisir une photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onSelectAvatar(result.assets[0].uri);
      onClose();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à votre caméra pour prendre une photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onSelectAvatar(result.assets[0].uri);
      onClose();
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
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choisir un avatar</Text>

          {/* Onglets */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'default' && styles.activeTab]}
              onPress={() => setSelectedTab('default')}
            >
              <Text style={[styles.tabText, selectedTab === 'default' && styles.activeTabText]}>
                Avatars
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'camera' && styles.activeTab]}
              onPress={() => setSelectedTab('camera')}
            >
              <Text style={[styles.tabText, selectedTab === 'camera' && styles.activeTabText]}>
                Photo
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === 'default' ? (
            // Avatars par défaut
            <FlatList
              data={DEFAULT_AVATARS}
              numColumns={4}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.avatarItem, { backgroundColor: item.color }]}
                  onPress={() => {
                    onSelectAvatar({ emoji: item.emoji, color: item.color });
                    onClose();
                  }}
                >
                  <Text style={styles.avatarEmoji}>{item.emoji}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.avatarGrid}
            />
          ) : (
            // Options caméra/galerie
            <View style={styles.cameraOptions}>
              <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                <Text style={styles.cameraButtonIcon}>📸</Text>
                <Text style={styles.cameraButtonText}>Prendre une photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cameraButton} onPress={pickImageFromGallery}>
                <Text style={styles.cameraButtonIcon}>🖼️</Text>
                <Text style={styles.cameraButtonText}>Choisir dans la galerie</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  avatarGrid: {
    alignItems: 'center',
  },
  avatarItem: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  cameraOptions: {
    paddingVertical: 20,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 5,
  },
  cameraButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cameraButtonText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});