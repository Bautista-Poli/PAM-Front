import React, { useRef, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const ICON_SIZE = 80;
const CHECK_COLOR = '#10b981';

interface SuccessCheckAnimationProps {
  onClose: () => void;
  isVisible: boolean;
  message: string;
}

export default function SuccessCheckAnimation({ onClose, isVisible, message }: SuccessCheckAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const checkProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isVisible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      checkProgress.setValue(0);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          bounciness: 10,
          speed: 8,
          useNativeDriver: true,
        }),
        Animated.timing(checkProgress, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
      }).start();
    }
  }, [isVisible, fadeAnim, scaleAnim, checkProgress]);

  const checkAnimatedStyle = {
    opacity: checkProgress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    }),
    transform: [{ scale: checkProgress }],
  };

  const modalAnimatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  const fadeValue = (fadeAnim as any).__getValue();
  if (!isVisible && fadeValue === 0) return null;

  return (
    <Modal
      animationType="none"
      transparent
      visible={isVisible || fadeValue > 0}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, styles.successModalContainer, modalAnimatedStyle]}>
          
          <View style={styles.iconContainer}>
            <Animated.View style={checkAnimatedStyle}>
                <Ionicons
                    name="checkmark-circle"
                    size={ICON_SIZE}
                    color={CHECK_COLOR}
                />
            </Animated.View>
          </View>
          
          <Text style={[styles.modalTitle, styles.successModalTitle]}>¡Evaluaciones Guardadas!</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          
          <Pressable
              style={[styles.modalButton, styles.successModalButton]}
              onPress={onClose}
          >
              <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        width: '85%',
        maxWidth: 350,
        borderRadius: 10,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    modalMessage: {
        color: '#e5e7eb',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    modalButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    successModalContainer: {
        backgroundColor: '#0b4928ff',
        borderColor: '#10b981',
    },
    successModalTitle: {
        color: '#ffffffff',
    },
    successModalButton: {
        backgroundColor: '#10b981',
    },
    iconContainer: {
        marginBottom: 16,
        marginTop: 8,
        height: ICON_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});