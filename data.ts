import { LegalConcept } from './types';
import { supabase } from './lib/supabase';

// Data from Supabase
// Data from Supabase with safety timeout
export const fetchLegalConcepts = async (): Promise<LegalConcept[]> => {
  try {
    const fetchPromise = supabase
      .from('legal_concepts')
      .select('*')
      .order('created_at', { ascending: true });

    // Timeout after 10 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), 10000)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (error) {
      console.error('Error fetching legal concepts:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      concept: row.concept,
      category: row.category,
      subcategory: row.subcategory,
      definitionSimple: row.definition_simple,
      realExample: row.real_example,
      regulation: row.regulation,
      jurisprudence: row.jurisprudence,
      videoUrl: row.video_url
    }));
  } catch (err) {
    console.error('Fetch legal concepts failed:', err);
    return [];
  }
};

// Fallback / legacy data (keeping it for reference or initial build)
const rawDataLegacy = `DC-TL-001;Ley;Derecho Civil;Teoría de la Ley;Declaración de la voluntad soberana que, manifestada en la forma prescrita por la Constitución, manda, prohíbe o permite.;La Ley de Tránsito manda a detenerse ante un disco Pare, prohíbe conducir ebrio y permite virar con luz roja si está señalizado.;Código Civil, Art. 1;Corte Suprema, Rol 94279-2020;https://www.youtube.com/watch?v=T3UR-Pwc0dM`;

export const legalConcepts: LegalConcept[] = rawDataLegacy.split('\n').map(line => {
  const [id, concept, category, subcategory, definitionSimple, realExample, regulation, jurisprudence, videoUrl] = line.split(';');
  return { id, concept, category, subcategory, definitionSimple, realExample, regulation, jurisprudence, videoUrl };
});

export const categories = [
  'Derecho Civil',
  'Derecho Penal',
  'Derecho Laboral',
  'Derecho Administrativo',
  'Derecho Constitucional',
  'Derecho Procesal',
  'Derecho Comercial',
  'Derecho de Familia',
  'Derecho Tributario',
  'Derecho Internacional'
];

