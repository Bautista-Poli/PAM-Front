import React, { useState } from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import TooltipGuide from './TooltipGuide'; // Ajusta la ruta

// Definimos los pasos con sus respectivas imágenes descriptivas
const pasosGuia = [
  { 
    title: "¡Bienvenido!", 
    description: "Aquí puedes ver los partidos de fútbol de tus ligas favoritas en tiempo real." 
  },
  { 
    title: "Filtra por fecha", 
    description: "Usa los botones de Ayer, Hoy y Mañana para navegar entre las jornadas.",
    image: require('../../../assets/images/howToBegin/DiaBoton.jpeg') 
  },
  { 
    title: "Selector de Ligas", 
    description: "Toca el selector para cambiar rápidamente entre los torneos disponibles.",
    image: require('../../../assets/images/howToBegin/ElegirLigaBoton.jpeg') 
  },
  { 
    title: "Tablas de Posiciones", 
    description: "Si tocas el nombre de la liga, podrás ver la tabla de posiciones completa con todos los equipos.",
    image: require('../../../assets/images/howToBegin/ConocerLigaBoton.jpeg') 
  },
  { 
    title: "Tu Perfil", 
    description: "Arriba a la derecha accede al menú para ver tu equipo favorito, editar tu perfil o cerrar sesión.",
    image: require('../../../assets/images/howToBegin/MenuDesplegableBoton.jpeg') 
  },
  { 
    title: "Califica a los Jugadores", 
    description: "En 'Evaluar Partido' puedes dar puntajes individuales a cada jugador según su desempeño." 
  },
  { 
    title: "Información de Clubes", 
    description: "Toca el escudo de cualquier club para ver sus ratings históricos y toda su información detallada.",
    image: require('../../../assets/images/howToBegin/EquipoBoton.jpeg') 
  }
];

export default function HowToBegin() {
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    if (currentStep < pasosGuia.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowGuide(false);
      setCurrentStep(0);
    }
  };

  const startGuide = () => {
    setCurrentStep(0);
    setShowGuide(true);
  };

  return (
    <>
      {!showGuide && (
        <Pressable style={styles.helpButton} onPress={startGuide}>
          <Text style={styles.helpButtonText}>?</Text>
        </Pressable>
      )}

      <TooltipGuide 
        visible={showGuide} 
        step={pasosGuia[currentStep]} 
        onNext={handleNextStep} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  helpButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#A9D6E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  helpButtonText: {
    color: '#112336',
    fontSize: 26,
    fontWeight: 'bold',
  },
});