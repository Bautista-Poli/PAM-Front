import React, { useState } from 'react';
import { SectionList, Text, StyleSheet, Alert } from 'react-native';
import PlayerItem from './playerCard';
import { MatchRow, Player } from '../apiConnections/types';
import EvaluarFooter from './botonDeEvaluar';
import PartidoCard from './partido';
import { postRatings } from '../apiConnections/apileagues';
import { useRouter } from 'expo-router';

type SectionJugadores = {
    title: string;
    teamName: string;
    data: Player[];
};

type Props = {
    sections: SectionJugadores[];
    loading: boolean;
    partidoData: MatchRow;
    userId: number;
};

export default function PlayersSectionList({sections, loading, partidoData, userId}: Props) {
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    function onChangeRating(id: number, value: number) {
        setRatings((prev: any) => ({ ...prev, [id]: value }));
    };

    async function handleEvaluar() {
        const ratingsArray = Object.entries(ratings)
            .filter(([_, rating]) => rating > 0)
            .map(([playerId, rating]) => ({
                playerId: parseInt(playerId),
                rating: rating,
            }));
        if (ratingsArray.length === 0) {
            Alert.alert('Error', 'Debes calificar al menos un jugador');
            return;
        }

        setSubmitting(true);

        try {
            const matchId = parseInt(partidoData.id);
            const result = await postRatings(userId, matchId, ratingsArray);

            if (result) {
                Alert.alert('Éxito', `Se guardaron ${result.ratingsCreated} evaluaciones correctamente`,
                    [{text: 'OK', onPress: () => {
                                setRatings({});
                                router.back();
                            },
                        },
                    ]
                );
            }
        }
        catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudieron guardar las evaluaciones');
        }
        finally {
            setSubmitting(false);
        }
    }
    

    return (
        <SectionList<Player, SectionJugadores>
            sections={sections}
            keyExtractor={(item) => String(item.id)}
            style={styles.list}
            contentContainerStyle={styles.content}
            contentInsetAdjustmentBehavior="automatic"
            ListHeaderComponent={<PartidoCard data={partidoData} />}
            ListFooterComponent={
                <EvaluarFooter
                    onPress={ handleEvaluar }
                    disabled = { submitting }
                />
            }
            renderSectionHeader={({ section }) => (
                <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            renderSectionFooter={({ section }) =>
                !loading && section.data.length === 0 ? (
                    <Text style={styles.emptySectionMsg}>
                        No hay jugadores cargados en la base de datos para {section.teamName}.
                    </Text>
                ) : null
            }
            renderItem={({ item }) => (
                <PlayerItem
                    name={item.full_name}
                    rating={ratings[item.id] ?? 0}
                    onChangeRating={(newRating: number) => onChangeRating(item.id, newRating)}

                />
            )}
        />
    );
}


export const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: '#0b1220',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 40,
    },
    sectionTitle: {
        color: '#93c5fd',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySectionMsg: {
        color: '#9ca3af',
        fontSize: 13,
        fontStyle: 'italic',
        lineHeight: 18,
        marginHorizontal: 16,
        marginBottom: 12,
    },
});

