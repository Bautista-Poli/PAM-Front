import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, ImageSourcePropType } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeIn, 
  FadeOut 
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

// Definimos la estructura de cada paso de la guía
interface GuideStep {
  title: string;
  description: string;
  image?: ImageSourcePropType;
}

interface TooltipGuideProps {
  visible: boolean;
  step: GuideStep;
  onNext: () => void;
}

const TooltipGuide: React.FC<TooltipGuideProps> = ({ visible, step, onNext }) => {
  const translateY = useSharedValue(height);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 90 });
    } else {
      translateY.value = withSpring(height);
    }
  }, [visible, step]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View 
        entering={FadeIn} 
        exiting={FadeOut} 
        style={styles.darkOverlay} 
      />

      <Animated.View style={[styles.tooltipContainer, animatedStyle]}>
        <View style={styles.indicator} />
        {step.image && (
          <View style={styles.imageContainer}>
            <Image 
              source={step.image} 
              style={styles.stepImage} 
              resizeMode="contain" 
            />
          </View>
        )}
        
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
        
        
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={onNext}
        >
          <Text style={styles.buttonText}>
            {step.title === "¡Bienvenido!" ? "Empezar" : "Siguiente"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 0, // Pegado abajo tipo Modal/Sheet
    left: 0,
    right: 0,
    backgroundColor: '#1E6091', // El azul de tu paleta
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 50, // Espacio extra por el notch/barra de inicio
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#A9D6E5',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E5F6FF',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#A9D6E5',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: '100%', // Botón ancho para que sea fácil de tocar
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#112336',
    fontWeight: '800',
    fontSize: 17,
  },
  imageContainer: {
    width: '100%',
    height: 150, // Ajusta esta altura según tus capturas
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(169, 214, 229, 0.3)',
  },
  stepImage: {
    width: '90%',
    height: '90%',
  },
});

export default TooltipGuide;