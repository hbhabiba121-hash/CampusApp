
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const SWIPE_THRESHOLD = -100;

type StudentCardProps = {
  id: number;
  name: string;
  email: string;
  role: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function StudentCard({ id, name, email, role, onDelete, onEdit }: StudentCardProps) {
  const translateX = useSharedValue(0);

  
  const onGestureEvent = (event: any) => {
    translateX.value = Math.min(0, event.nativeEvent.translationX);
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === 4) { 
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-200); 
      } else {
        translateX.value = withSpring(0); 
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    router.push(`/users/${id}`);
  };

  const handleEdit = () => {
    translateX.value = withSpring(0);
    runOnJS(onEdit)(id);
  };

  const handleDelete = () => {
    translateX.value = withSpring(0);
    runOnJS(onDelete)(id);
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.cardContainer}>
        {/* Boutons en arrière-plan */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={handleEdit}
          >
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDelete}
          >
            <Text style={styles.actionButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>

        {/* Carte principale avec gestion du swipe */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[styles.card, animatedStyle]}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
              <Text style={styles.role}>{role}</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    position: 'relative',
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
    zIndex: 2,
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
  buttonsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 200,
    flexDirection: 'row',
    zIndex: 1,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});