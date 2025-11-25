import { WorkerAnalyzeResponse } from "@/types";

const API_BASE_URL = 'http://localhost:8000';

export const analyzeNiche = async (niche: string): Promise<WorkerAnalyzeResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ niche }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to analyze niche:", error);
        throw error;
    }
};

export const generateStoryboard = async (productName: string, benefits: string[]): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-storyboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_name: productName, benefits }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to generate storyboard:", error);
        throw error;
    }
};

export const publishCampaign = async (productData: any, userTokens: any): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_data: productData, user_tokens: userTokens }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to publish campaign:", error);
        throw error;
    }
};
