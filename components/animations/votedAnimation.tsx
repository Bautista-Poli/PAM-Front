import { useRef, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

interface AlreadyVotedModalProps {
    onClose: () => void;
    isVisible: boolean;
}

export default function AlreadyVotedModal({ onClose, isVisible }: AlreadyVotedModalProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const iconScaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {toValue: 0,  bounciness: 8, speed: 4, useNativeDriver: true,}),
                
                Animated.spring(iconScaleAnim, {
                    toValue: 1,
                    delay: 200,
                    bounciness: 12,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: screenHeight, duration: 250, useNativeDriver: true }),
                Animated.timing(iconScaleAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
        }
    }, [isVisible, fadeAnim, slideAnim, iconScaleAnim]);

    const modalAnimatedStyle = {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
    };

    const iconAnimatedStyle = {
        transform: [{ scale: iconScaleAnim }]
    };

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>


                    <View style={styles.iconContainer}>
                        <Animated.View style={iconAnimatedStyle}>
                            <Ionicons  name="close-circle" size={64} color="#DC2626" />
                        </Animated.View>
                    </View>


                    <Text style={[styles.modalTitle, styles.errorText]}>Ya evaluaste este partido</Text>
                    <Text style={[styles.modalMessage, styles.errorText]}>
                        No podés evaluar el mismo partido dos veces.
                    </Text>


                    <Pressable style={[styles.modalButton, styles.errorButton]} onPress={onClose}>
                        <Text style={styles.modalButtonText}>Volver</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    modalContainer: {
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#fff",
        padding: 20,
        alignItems: 'center',
    },

    iconContainer: {
        marginBottom: 16,
        marginTop: 8,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#DC2626',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center"
    },
    modalMessage: {
        fontSize: 16,
        color: "#444",
        textAlign: "center",
        marginBottom: 24
    },

    modalButton: {
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#007AFF",
    },
    errorButton: {
        backgroundColor: "#DC2626",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});