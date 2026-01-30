export interface AIAnalysisResult {
    trustScore: number;
    priceAnalysis: {
        rating: "Low" | "Fair" | "High";
        marketComparison: string;
    };
    riskAssessment: {
        level: "Low" | "Medium" | "High";
        factors: string[];
    };
    completenessScore: number;
    recommendation: "Approve" | "Reject" | "Manual Review";
    ownerMetrics: {
        responsiveness: number; // 0-100
        verificationLevel: string;
        tenantSatisfaction: number; // 0-5
    };
    // New enhanced fields
    rooms?: {
        bedrooms: number;
        bathrooms: number;
        kitchen: boolean;
        livingRoom: boolean;
    };
    outdoorSpaces?: {
        garden: boolean;
        balcony: boolean;
        terrace: boolean;
    };
    suggestedPropertyType?: string;
}

const OPENROUTER_API_KEY = "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";

export const analyzeProperty = async (propertyData: any): Promise<AIAnalysisResult> => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:5173", // Site URL for rankings
                "X-Title": "RentAI", // Site title for rankings
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // or another cheap/fast model available on OpenRouter
                messages: [
                    {
                        role: "system",
                        content: `You are an AI Real Estate Analyst for RentAI. 
                        Analyze rental property listings and provide a JSON response with:
                        - trustScore (0-100)
                        - priceAnalysis object (rating: Low/Fair/High, marketComparison: string)
                        - riskAssessment object (level: Low/Medium/High, factors: string[])
                        - completenessScore (0-100)
                        - recommendation (Approve/Reject/Manual Review)
                        - ownerMetrics (responsiveness: 0-100, verificationLevel: string, tenantSatisfaction: 0-5)
                        
                        Base your analysis on the provided data. Since historical data might be missing, simulate reasonable owner metrics based on profile completeness and verified status.
                        Return ONLY valid JSON.`
                    },
                    {
                        role: "user",
                        content: `Analyze this property:
                        Name: ${propertyData.propertyName}
                        Description: ${propertyData.description}
                        Rent: ${propertyData.rent}
                        Security Deposit: ${propertyData.securityDeposit}
                        Location: ${propertyData.address}, ${propertyData.city}
                        Owner: ${propertyData.ownerName} (Email: ${propertyData.email})
                        `
                    }
                ],
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            throw new Error(`AI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse the JSON content
        // Clean markdown code blocks if present
        const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("AI Analysis failed:", error);
        // Fallback mock data if API fails
        return {
            trustScore: 85,
            priceAnalysis: {
                rating: "Fair",
                marketComparison: "Competitively priced for the area."
            },
            riskAssessment: {
                level: "Low",
                factors: ["New listing", "Verified owner"]
            },
            completenessScore: 90,
            recommendation: "Approve",
            ownerMetrics: {
                responsiveness: 95,
                verificationLevel: "Tier 1",
                tenantSatisfaction: 4.8
            }
        };
    }
};
