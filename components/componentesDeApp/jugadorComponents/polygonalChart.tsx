// components/charts/RadarChart.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface RadarDataPoint {
  label: string;
  value: number; // 0-100
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  levels?: number;
  maxValue?: number;
  fillColor?: string;
  strokeColor?: string;
  labelColor?: string;
  animated?: boolean;
}

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

export default function RadarChart({
  data,
  size = 270,
  levels = 5,
  maxValue = 100,
  fillColor = 'rgba(43, 113, 194, 0.4)',
  strokeColor = '#2b71c2ff',
  labelColor = '#e5e7eb',
  animated = true,
}: RadarChartProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const center = size / 2;
  const radius = (size / 2) * 0.65;
  const angleStep = (2 * Math.PI) / data.length;

  useEffect(() => {
    if (animated) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: false,
        tension: 40,
        friction: 8,
      }).start();
    } else {
      animatedValue.setValue(1);
    }
  }, [data]);

  const getPoint = (value: number, index: number, scale: number = 1) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius * scale;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLevelPoints = (levelIndex: number) => {
    const levelRadius = (radius / levels) * (levelIndex + 1);
    return data.map((_, index) => {
      const angle = angleStep * index - Math.PI / 2;
      return {
        x: center + levelRadius * Math.cos(angle),
        y: center + levelRadius * Math.sin(angle),
      };
    });
  };

  const pointsToString = (points: { x: number; y: number }[]) => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  const getLabelPoint = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const labelRadius = radius + 40;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  const dataPoints = data.map((item, index) => getPoint(item.value, index));
  const zeroPoints = data.map((_, index) => getPoint(0, index));

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
          </RadialGradient>
        </Defs>

        {/* Niveles de fondo */}
        {[...Array(levels)].map((_, levelIndex) => {
          const levelPoints = getLevelPoints(levelIndex);
          return (
            <Polygon
              key={`level-${levelIndex}`}
              points={pointsToString(levelPoints)}
              fill={levelIndex === levels - 1 ? "url(#grad)" : "none"}
              stroke="#1E3A5F"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Líneas desde el centro */}
        {data.map((_, index) => {
          const point = getLabelPoint(index);
          return (
            <Line
              key={`line-${index}`}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#1E3A5F"
              strokeWidth="1"
              opacity={0.4}
            />
          );
        })}

        {/* Polígono de datos con animación */}
        {animated ? (
          <AnimatedPolygon
            points={animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [
                pointsToString(zeroPoints),
                pointsToString(dataPoints),
              ],
            })}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
          />
        ) : (
          <Polygon
            points={pointsToString(dataPoints)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
          />
        )}

        {/* Puntos en cada vértice */}
        {dataPoints.map((point, index) => (
          <Circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={strokeColor}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}

        {/* Etiquetas */}
        {data.map((item, index) => {
          const labelPoint = getLabelPoint(index);
          const angle = angleStep * index - Math.PI / 2;
          const isRight = Math.cos(angle) > 0.1;
          const isLeft = Math.cos(angle) < -0.1;
          
          return (
            <React.Fragment key={`label-${index}`}>
              <SvgText
                x={labelPoint.x}
                y={labelPoint.y - 8}
                fill={labelColor}
                fontSize="13"
                fontWeight="700"
                textAnchor={isRight ? "start" : isLeft ? "end" : "middle"}
              >
                {item.label}
              </SvgText>
              <SvgText
                x={labelPoint.x}
                y={labelPoint.y + 8}
                fill="#94a3b8"
                fontSize="12"
                fontWeight="600"
                textAnchor={isRight ? "start" : isLeft ? "end" : "middle"}
              >
                {item.value}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});