import React, { useState } from 'react';
import { SectionList, Text, StyleSheet, Alert, Modal, View, Pressable } from 'react-native';
import PlayerItem from './playerCard';
import { MatchRow, Player } from '../apiConnections/types';
import EvaluarFooter from './botonDeEvaluar';
import PartidoCard from './partido';
import { postRatings } from '../apiConnections/apileagues';
import { useRouter } from 'expo-router';
import SuccessCheckAnimation from '../animations/successAnimation';

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

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    function onChangeRating(id: number, value: number) {
        setRatings((prev: any) => ({ ...prev, [id]: value }));
    };

    function handleCloseSuccessModal() {
        setShowSuccessModal(false);
        setRatings({});
        router.back();
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
                setSuccessMessage(`Se guardaron ${result.ratingsCreated} evaluaciones correctamente`);
                setShowSuccessModal(true);
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
        <View style={styles.listWrapper}>
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
            <SuccessCheckAnimation
                isVisible={showSuccessModal}
                onClose={handleCloseSuccessModal} // Esta función también hace el router.back()
                message={successMessage}
            />

        </View>
    );
}


export const styles = StyleSheet.create({
    listWrapper: {
        flex: 1,
        backgroundColor: '#0b1220',
    },
    list: {
        flex: 1,
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
});