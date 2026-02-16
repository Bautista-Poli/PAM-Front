import React, { useState, useEffect } from 'react';
import { SectionList, Text, Alert, View } from 'react-native';
import PlayerItem from '../playerCard';
import { useRouter } from 'expo-router';
import SuccessCheckAnimation from '../../animations/successAnimation';
import AlreadyVotedModal from '../../animations/votedAnimation';
import { styles } from './playerVotingSectionStyle'; 
import EvaluarFooter from './botonDeEvaluar';
import { getUserMatchRatings, postRatings, updateRatings } from '@/apiConnections/ratings';

export default function PlayerVotingSectionList({ sections, partidoData, userId }: any) {
    const router = useRouter();
    
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [modalStatus, setModalStatus] = useState<'none' | 'success' | 'voted'>('none');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchExisting = async () => {
            if (!partidoData?.id || !userId) return;

            try {
                const matchId = parseInt(partidoData.id);
                const prevRatings = await getUserMatchRatings(userId, matchId);
                
                if (prevRatings && prevRatings.length > 0) {
                    const initialMap = prevRatings.reduce((acc: any, curr: any) => {
                        acc[curr.player_id] = curr.rating;
                        return acc;
                    }, {});
                    
                    setRatings(initialMap);
                }
            } catch (e) {
                console.log("No hay votos previos o error de carga");
            }
        };

        fetchExisting();
    }, [partidoData.id, userId]);

    const handleEvaluar = async (forceUpdate = false) => {
        const payload = Object.entries(ratings)
            .filter(([_, r]) => r > 0)
            .map(([id, r]) => ({ playerId: parseInt(id), rating: r }));

        if (payload.length === 0) {
            return Alert.alert('Aviso', 'Calificá al menos un jugador');
        }

        setSubmitting(true);
        try {
            const matchId = parseInt(partidoData.id);
            
            const res = forceUpdate 
                ? await updateRatings(userId, matchId, payload)
                : await postRatings(userId, matchId, payload);

            if (res) {
                setSuccessMsg(forceUpdate ? "¡Evaluación actualizada!" : `¡${res.ratingsCreated} evaluaciones enviadas!`);
                setModalStatus('success');
            }
        } catch (e: any) {
            if (e.message.includes("Ya has evaluado")) {
                // Si el backend rechaza por duplicado, ofrecemos modificar
                Alert.alert(
                    "Ya calificaste este partido",
                    "¿Deseas sobreescribir tus calificaciones anteriores?",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { 
                            text: "Sí, actualizar", 
                            onPress: () => handleEvaluar(true) 
                        }
                    ]
                );
            } else {
                Alert.alert('Error', e.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.listWrapper}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PlayerItem
                        name={item.full_name}
                        rating={ratings[item.id] || 0}
                        onChangeRating={(v: number) => setRatings(prev => ({ ...prev, [item.id]: v }))}
                    />
                )}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                ListFooterComponent={
                  <EvaluarFooter onPress={handleEvaluar} disabled={submitting} />
                }
            />

            <SuccessCheckAnimation 
                isVisible={modalStatus === 'success'} 
                message={successMsg} 
                onClose={() => router.back()} 
            />
            
            <AlreadyVotedModal 
                isVisible={modalStatus === 'voted'} 
                onClose={() => router.back()} 
            />
        </View>
    );
}