import React, { useState } from 'react';
import { SectionList, Text } from 'react-native';
import PlayerItem from './playerCard';

import { StyleSheet } from 'react-native';
import { MatchRow, Player } from '../apiConnections/types';
import EvaluarFooter from './botonDeEvaluar';
import PartidoCard from './partido';


type SectionJugadores = {
    title: string;
    teamName: string;
    data: Player[];
};

type Props = {
    sections: SectionJugadores[];
    loading: boolean;
    partidoData: MatchRow;
};

export default function PlayersSectionList({ sections,loading,partidoData}: Props) {
    const [ratings, setRatings] = useState<Record<number, number>>({});

    function onChangeRating(id: number, value: number) {
        setRatings((prev: any) => ({ ...prev, [id]: value }));
    };
    

    return (
        <SectionList<Player, SectionJugadores>
            sections={sections}
            keyExtractor={(item) => String(item.id)}
            style={styles.list}
            contentContainerStyle={styles.content}
            contentInsetAdjustmentBehavior="automatic"
            ListHeaderComponent={<PartidoCard data={partidoData} />}
            ListFooterComponent={<EvaluarFooter
                onPress={() => {
                    setRatings({});
                    console.log("Evaluaciones (solo log, sin POST):", ratings);
                }}
            />}
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

