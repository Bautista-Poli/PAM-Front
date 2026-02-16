import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useState, useRef, ReactNode } from "react";

interface AnimatedTabMenuProps {
  tabs: string[];
  onTabChange?: (index: number) => void;
  children: (activeTab: number) => ReactNode;
}

export default function AnimatedTabMenu({ tabs, onTabChange, children }: AnimatedTabMenuProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
    
    Animated.spring(slideAnim, {
      toValue: -index,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
    
    Animated.spring(indicatorAnim, {
      toValue: index,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
  };

  const tabWidth = 100 / tabs.length;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => switchTab(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Indicador animado */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: `${tabWidth}%`,
              transform: [{
                translateX: indicatorAnim.interpolate({
                  inputRange: tabs.map((_, i) => i),
                  outputRange: tabs.map((_, i) => i * (100 / tabs.length) * 3.7),
                })
              }]
            }
          ]}
        />
      </View>

      {/* Contenido */}
      <View style={styles.contentWrapper}>
        {children(activeTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: "#162236",
    borderBottomWidth: 1,
    borderBottomColor: "#1e3a5f",
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: "#64748b",
  },
  tabTextActive: {
    color: "#3b82f6",
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  contentWrapper: {
    flex: 1,
  },
});