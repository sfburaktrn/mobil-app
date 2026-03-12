import { TournamentMatch, Wrestler } from './mockData';

export interface BracketMatch {
    id: string;
    roundIndex: number;
    roundLabel: string;
    matchNumber: number;
    wrestler1?: Wrestler;
    wrestler2?: Wrestler;
    autoAdvance?: boolean;
}

const getRoundLabel = (roundIndex: number, roundSize: number) => {
    if (roundSize === 1) {
        return 'Başpehlivan Finali';
    }

    if (roundSize === 2) {
        return 'Finale Giden Yol';
    }

    if (roundSize === 3 || roundSize === 5) {
        return `${roundIndex + 1}. Tur / Kura Avantajı`;
    }

    return `${roundIndex + 1}. Tur`;
};

export const getPredictedWinner = (
    match: BracketMatch,
    predictions: Record<string, number>
) => {
    if (match.autoAdvance) {
        return match.wrestler1;
    }

    const predictedWinnerId = predictions[match.id];

    if (!predictedWinnerId) {
        return undefined;
    }

    if (match.wrestler1?.id === predictedWinnerId) {
        return match.wrestler1;
    }

    if (match.wrestler2?.id === predictedWinnerId) {
        return match.wrestler2;
    }

    return undefined;
};

export const buildBracket = (
    initialMatches: TournamentMatch[],
    predictions: Record<string, number>
) => {
    const firstRound: BracketMatch[] = initialMatches.map((match, index) => ({
        id: match.id,
        roundIndex: 0,
        roundLabel: '1. Tur',
        matchNumber: index + 1,
        wrestler1: match.wrestler1,
        wrestler2: match.wrestler2,
    }));

    const rounds: BracketMatch[][] = [firstRound];
    let previousRound = firstRound;
    let roundIndex = 1;

    while (previousRound.length > 1) {
        const nextRound: BracketMatch[] = [];

        for (let i = 0; i < previousRound.length; i += 2) {
            const leftMatch = previousRound[i];
            const rightMatch = previousRound[i + 1];
            const leftWinner = getPredictedWinner(leftMatch, predictions);
            const rightWinner = rightMatch ? getPredictedWinner(rightMatch, predictions) : undefined;

            if (!rightMatch) {
                nextRound.push({
                    id: `round_${roundIndex + 1}_auto_${Math.floor(i / 2) + 1}`,
                    roundIndex,
                    roundLabel: getRoundLabel(roundIndex, Math.ceil(previousRound.length / 2)),
                    matchNumber: Math.floor(i / 2) + 1,
                    wrestler1: leftWinner,
                    autoAdvance: true,
                });
                continue;
            }

            nextRound.push({
                id: `round_${roundIndex + 1}_match_${Math.floor(i / 2) + 1}`,
                roundIndex,
                roundLabel: getRoundLabel(roundIndex, Math.ceil(previousRound.length / 2)),
                matchNumber: Math.floor(i / 2) + 1,
                wrestler1: leftWinner,
                wrestler2: rightWinner,
            });
        }

        rounds.push(nextRound);
        previousRound = nextRound;
        roundIndex += 1;
    }

    return rounds;
};
