import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LegalConcept } from '../types';
import { fetchLegalConcepts } from '../data';

interface ConceptsContextType {
    concepts: LegalConcept[];
    loading: boolean;
    error: Error | null;
    refreshConcepts: () => Promise<void>;
    getConceptById: (id: string) => LegalConcept | undefined;
}

const ConceptsContext = createContext<ConceptsContextType | undefined>(undefined);

export const ConceptsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [concepts, setConcepts] = useState<LegalConcept[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadConcepts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Cargando conceptos...');
            const data = await fetchLegalConcepts();
            console.log('✅ Conceptos cargados:', data.length);
            setConcepts(data);
        } catch (err) {
            console.error('❌ Error cargando conceptos:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch concepts'));
            // Set empty array on error so app doesn't crash
            setConcepts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConcepts();
    }, []);

    const refreshConcepts = async () => {
        await loadConcepts();
    };

    const getConceptById = (id: string): LegalConcept | undefined => {
        return concepts.find(c => c.id === id);
    };

    return (
        <ConceptsContext.Provider value={{
            concepts,
            loading,
            error,
            refreshConcepts,
            getConceptById
        }}>
            {children}
        </ConceptsContext.Provider>
    );
};

export const useConcepts = (): ConceptsContextType => {
    const context = useContext(ConceptsContext);
    if (!context) {
        throw new Error('useConcepts must be used within ConceptsProvider');
    }
    return context;
};
