import {
    CompetitorAnalysis
} from "../types";

/**
 * Public War Room Edition - API Proxy Service
 * This service routes requests to the secure backend endpoint for competitor analysis.
 */
export const analyzeCompetitor = async (url: string): Promise<{ data: CompetitorAnalysis; sources: string[] }> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error('Failed to connect to Intelligence Engine');
        }

        const data = await response.json();

        return {
            data: data,
            sources: []
        };
    } catch (error) {
        console.error("Proxy Error", error);
        throw error;
    }
};
