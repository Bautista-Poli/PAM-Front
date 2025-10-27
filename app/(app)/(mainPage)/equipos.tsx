// app/equipos.tsx
import { View, Text, StyleSheet, Pressable, Image, FlatList } from "react-native";
import { Stack, useRouter } from "expo-router";

type Equipo = {
  nombre: string;
  escudo: string;
};

const equipos: Equipo[] = [
  {
    nombre: "Aldosivi",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Escudo_de_Aldosivi.svg/800px-Escudo_de_Aldosivi.svg.png",
  },
  {
    nombre: "Argentinos Juniors",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Argentinos_Juniors_crest.svg/800px-Argentinos_Juniors_crest.svg.png",
  },
  {
    nombre: "Atlético Tucumán",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Escudo_del_Club_Atl%C3%A9tico_Tucum%C3%A1n.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Tucum%C3%A1n.svg.png",
  },
  {
    nombre: "Banfield",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_del_Club_Atl%C3%A9tico_Banfield.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Banfield.svg.png",
  },
  {
    nombre: "Barracas Central",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Escudo_del_Club_Atl%C3%A9tico_Barracas_Central.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Barracas_Central.svg.png",
  },
  {
    nombre: "Belgrano",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Escudo_del_Club_Atl%C3%A9tico_Belgrano.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Belgrano.svg.png",
  },
  {
    nombre: "Boca Juniors",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/CABJ_Logo.svg/800px-CABJ_Logo.svg.png",
  },
  {
    nombre: "Central Córdoba",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Escudo_del_Club_Atl%C3%A9tico_Central_C%C3%B3rdoba_%28Santiago_del_Estero%29.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Central_C%C3%B3rdoba_%28Santiago_del_Estero%29.svg.png",
  },
  {
    nombre: "Defensa y Justicia",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Escudo_del_Club_Social_y_Deportivo_Defensa_y_Justicia.svg/800px-Escudo_del_Club_Social_y_Deportivo_Defensa_y_Justicia.svg.png",
  },
  {
    nombre: "Estudiantes",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Escudo_del_Club_Estudiantes_de_La_Plata.svg/800px-Escudo_del_Club_Estudiantes_de_La_Plata.svg.png",
  },
  {
    nombre: "Gimnasia",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Escudo_del_Club_de_Gimnasia_y_Esgrima_La_Plata.svg/800px-Escudo_del_Club_de_Gimnasia_y_Esgrima_La_Plata.svg.png",
  },
  {
    nombre: "Godoy Cruz",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Escudo_del_Club_Deportivo_Godoy_Cruz_Antonio_Tomba.svg/800px-Escudo_del_Club_Deportivo_Godoy_Cruz_Antonio_Tomba.svg.png",
  },
  {
    nombre: "Huracán",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Escudo_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg.png",
  },
  {
    nombre: "Independiente",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Independiente.svg.png",
  },
  {
    nombre: "Independiente Rivadavia",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Escudo_del_Club_Sportivo_Independiente_Rivadavia.svg/800px-Escudo_del_Club_Sportivo_Independiente_Rivadavia.svg.png",
  },
  {
    nombre: "Instituto",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Escudo_del_Instituto_Atl%C3%A9tico_Central_C%C3%B3rdoba.svg/800px-Escudo_del_Instituto_Atl%C3%A9tico_Central_C%C3%B3rdoba.svg.png",
  },
  {
    nombre: "Lanús",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Escudo_del_Club_Atl%C3%A9tico_Lan%C3%BAs.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Lan%C3%BAs.svg.png",
  },
  {
    nombre: "Newell's",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys.svg.png",
  },
  {
    nombre: "Platense",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Escudo_del_Club_Atl%C3%A9tico_Platense.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Platense.svg.png",
  },
  {
    nombre: "Racing Club",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Escudo_de_Racing_Club_%282014%29.svg/800px-Escudo_de_Racing_Club_%282014%29.svg.png",
  },
  {
    nombre: "River Plate",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Escudo_del_C_A_River_Plate.svg/800px-Escudo_del_C_A_River_Plate.svg.png",
  },
  {
    nombre: "Rosario Central",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Escudo_del_Club_Atl%C3%A9tico_Rosario_Central.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Rosario_Central.svg.png",
  },
  {
    nombre: "San Lorenzo",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg/800px-Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg.png",
  },
  {
    nombre: "San Martín",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Escudo_del_Club_Atl%C3%A9tico_San_Mart%C3%ADn_%28San_Juan%29.svg/800px-Escudo_del_Club_Atl%C3%A9tico_San_Mart%C3%ADn_%28San_Juan%29.svg.png",
  },
  {
    nombre: "Sarmiento",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Escudo_del_Club_Atl%C3%A9tico_Sarmiento.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Sarmiento.svg.png",
  },
  {
    nombre: "Talleres",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Escudo_del_Club_Atl%C3%A9tico_Talleres_%28C%C3%B3rdoba%29.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Talleres_%28C%C3%B3rdoba%29.svg.png",
  },
  {
    nombre: "Tigre",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Escudo_del_Club_Atl%C3%A9tico_Tigre.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Tigre.svg.png",
  },
  {
    nombre: "Unión",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Escudo_del_Club_Atl%C3%A9tico_Uni%C3%B3n_%28Santa_Fe%29.svg/800px-Escudo_del_Club_Atl%C3%A9tico_Uni%C3%B3n_%28Santa_Fe%29.svg.png",
  },
  {
    nombre: "Vélez Sarsfield",
    escudo: "https://paladarnegro.net/escudoteca/argentina/primeradivision/png/velez.png",
  },
  {
    nombre: "Deportivo Riestra",
    escudo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Escudo_del_Club_Deportivo_Riestra.svg/800px-Escudo_del_Club_Deportivo_Riestra.svg.png",
  },
];

export default function Equipos() {
  const router = useRouter();

  const renderEquipo = ({ item }: { item: Equipo }) => (
    <Pressable
      style={styles.equipoCard}
      onPress={() => router.push({
        pathname: '/equipo',
        params: { nombre: item.nombre }
      })}
    >
      <View style={styles.escudoContainer}>
        <Image
          source={{ uri: item.escudo }}
          style={styles.escudo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.equipoNombre} numberOfLines={2}>
        {item.nombre}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Equipos",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.btnVolver}>← Volver</Text>
            </Pressable>
          ),
        }}
      />

      <Text style={styles.titulo}>EQUIPOS</Text>

      <Text style={styles.subtitle}>Pulsar en el equipo para ver su info detallada</Text>

      <FlatList
        data={equipos}
        renderItem={renderEquipo}
        keyExtractor={(item) => item.nombre}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  btnVolver: {
    color: "#93c5fd",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  gridContainer: {
    padding: 12,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  equipoCard: {
    flex: 1,
    backgroundColor: "#112336",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E3A5F",
    maxWidth: "31%",
  },
  escudoContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  escudo: {
    width: "80%",
    height: "80%",
  },
  equipoNombre: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  titulo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10
  },
});