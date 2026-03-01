import { LegalConcept, MasterClass } from './types';
import { supabase } from './lib/supabase';

// Data from Supabase
// Data from Supabase with safety timeout
export const fetchLegalConcepts = async (): Promise<LegalConcept[]> => {
  try {
    let allData: any[] = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('legal_concepts')
        .select('*')
        .order('created_at', { ascending: true })
        .range(from, from + step - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += step;
        if (data.length < step) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    if (allData.length === 0) {
      console.log('Using legacy data because Supabase returned 0 results');
      return legalConcepts;
    }

    return allData.map((item: any) => ({
      id: item.id || '',
      concept: item.concept || '',
      category: item.category || '',
      subcategory: item.subcategory || '',
      definitionSimple: item.definition_simple || '',
      realExample: item.real_example || '',
      regulation: item.regulation || '',
      videoUrl: item.video_url || '',
      keyPoints: Array.isArray(item.key_points) ? item.key_points : []
    }));
  } catch (error) {
    console.error('Error in fetchLegalConcepts:', error);
    return legalConcepts;
  }
};

// Local fallback data for MasterClasses
export const masterClassesData: MasterClass[] = [
  {
    id: 'mc-iter-criminis',
    title: 'Iter Criminis',
    description: 'El iter criminis corresponde al proceso de realización de un delito y se analizan las etapas previas y la consumación, así como su relevancia penal según el Código Penal chileno.',
    video_url: 'https://www.youtube.com/watch?v=T3evFHyqKbM',
    thumbnail_url: 'https://img.youtube.com/vi/T3evFHyqKbM/maxresdefault.jpg',
    category: 'Derecho Penal',
    professor: 'Iuris Academy',
    duration: '5:07',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-bienes-muebles',
    title: 'Bienes Muebles',
    description: 'Explicación de qué son los bienes muebles y cómo se clasifican en el Derecho Civil.',
    video_url: 'https://www.youtube.com/watch?v=JL7exsX6agU',
    thumbnail_url: 'https://img.youtube.com/vi/JL7exsX6agU/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:09',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-bienes-fungibles',
    title: 'Bienes Fungibles y no fungibles',
    description: 'Definición de bienes fungibles y no fungibles, con énfasis en sus diferencias jurídicas básicas.',
    video_url: 'https://www.youtube.com/watch?v=Z_cMUTnLZh0',
    thumbnail_url: 'https://img.youtube.com/vi/Z_cMUTnLZh0/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:33',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-consentimiento',
    title: 'El Consentimiento',
    description: 'Definición de consentimiento y casos en que no es válido (error, fuerza y dolo; la lesión enorme se aborda en otro video).',
    video_url: 'https://www.youtube.com/watch?v=WN6nfRVcWMk',
    thumbnail_url: 'https://img.youtube.com/vi/WN6nfRVcWMk/maxresdefault.jpg',
    category: 'Acto Jurídico',
    professor: 'Iuris Academy',
    duration: '1:16',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-dominio',
    title: '¿Qué es el Dominio?',
    description: 'Definición de dominio y sus características esenciales dentro de la teoría de bienes.',
    video_url: 'https://www.youtube.com/watch?v=vaS2j5ZGysw',
    thumbnail_url: 'https://img.youtube.com/vi/vaS2j5ZGysw/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '0:51',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-derecho-real',
    title: 'Derecho Real Real y Personal',
    description: 'Explicación de qué es un derecho real y un derecho personal, con sus diferencias principales.',
    video_url: 'https://www.youtube.com/watch?v=Yjk2VklODOw',
    thumbnail_url: 'https://img.youtube.com/vi/Yjk2VklODOw/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:33',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-bienes-inmuebles',
    title: 'Bienes Inmuebles',
    description: 'Definición, clasificación y características de los bienes inmuebles.',
    video_url: 'https://www.youtube.com/watch?v=IdoUY7XyBzs',
    thumbnail_url: 'https://img.youtube.com/vi/IdoUY7XyBzs/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:02',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-clasificacion-procesal',
    title: 'Clasificación Derecho Procesal',
    description: 'Introducción al Derecho Procesal y sus tipos o clasificaciones básicas.',
    video_url: 'https://www.youtube.com/watch?v=FfqhGnosfXQ',
    thumbnail_url: 'https://img.youtube.com/vi/FfqhGnosfXQ/maxresdefault.jpg',
    category: 'Derecho Procesal',
    professor: 'Iuris Academy',
    duration: '1:06',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-modos-adquirir',
    title: 'Modos de Adquirir',
    description: 'Breve descripción de los modos de adquirir el dominio en Derecho Civil.',
    video_url: 'https://www.youtube.com/watch?v=xKY8ZOZxJSE',
    thumbnail_url: 'https://img.youtube.com/vi/xKY8ZOZxJSE/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:21',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-actos-unilateral',
    title: 'Actos Jurídicos Unilateral y Bilateral',
    description: 'Descripción y diferencia entre los actos jurídicos unilaterales y bilaterales.',
    video_url: 'https://www.youtube.com/watch?v=tZSWOR_1CSc',
    thumbnail_url: 'https://img.youtube.com/vi/tZSWOR_1CSc/maxresdefault.jpg',
    category: 'Acto Jurídico',
    professor: 'Iuris Academy',
    duration: '1:02',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-teoria-bienes',
    title: 'Introducción a la Teoría de Bienes',
    description: 'Breve introducción general a la teoría de bienes en el marco del Derecho Civil.',
    video_url: 'https://www.youtube.com/watch?v=h8bhCpK8QWg',
    thumbnail_url: 'https://img.youtube.com/vi/h8bhCpK8QWg/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:40',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-recomendacion-abogados',
    title: 'Recomendación para futuros abogados',
    description: 'Recomendación de una película clásica del cine dirigida a futuros abogados (video con advertencia de derechos de autor).',
    video_url: 'https://www.youtube.com/watch?v=IqEZbo95Szw',
    thumbnail_url: 'https://img.youtube.com/vi/IqEZbo95Szw/maxresdefault.jpg',
    category: 'Orientación',
    professor: 'Iuris Academy',
    duration: '1:00',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-bienes-corporales',
    title: 'BIENES CORPORALES',
    description: 'Video sobre bienes corporales; actualmente con descripción pendiente (“Añadir descripción”).',
    video_url: 'https://www.youtube.com/watch?v=k51bZHd05mE',
    thumbnail_url: 'https://img.youtube.com/vi/k51bZHd05mE/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:22',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-voluntad',
    title: 'La Voluntad',
    description: 'Explicación del concepto de voluntad en la teoría del acto jurídico.',
    video_url: 'https://www.youtube.com/watch?v=Ar9qJqO0OIw',
    thumbnail_url: 'https://img.youtube.com/vi/Ar9qJqO0OIw/maxresdefault.jpg',
    category: 'Acto Jurídico',
    professor: 'Iuris Academy',
    duration: '1:12',
    created_at: new Date().toISOString()
  },
  {
    id: 'mc-acto-juridico',
    title: 'Acto juridico',
    description: 'Introducción general al acto jurídico, sus elementos básicos y función en el Derecho Civil.',
    video_url: 'https://www.youtube.com/watch?v=rwX-NNPrVqA',
    thumbnail_url: 'https://img.youtube.com/vi/rwX-NNPrVqA/maxresdefault.jpg',
    category: 'Derecho Civil',
    professor: 'Iuris Academy',
    duration: '1:06',
    created_at: new Date().toISOString()
  }
];



export const fetchMasterClasses = async (): Promise<MasterClass[]> => {
  // Returning local data directly as requested to ensure only these 15 videos are shown
  return masterClassesData;
};



// Fallback / legacy data (keeping it for reference or initial build)
const rawDataLegacy = `DC-TL-001;Ley;Derecho Civil;Teoría de la Ley;Declaración de la voluntad soberana que, manifestada en la forma prescrita por la Constitución, manda, prohíbe o permite.;La Ley de Tránsito manda a detenerse ante un disco Pare, prohíbe conducir ebrio y permite virar con luz roja si está señalizado.;Código Civil, Art. 1;Corte Suprema, Rol 94279-2020;https://www.youtube.com/watch?v=T3UR-Pwc0dM`;

export const legalConcepts: LegalConcept[] = rawDataLegacy.split('\n').filter(line => line.trim()).map(line => {
  const parts = line.split(';');
  return {
    id: parts[0] || '',
    concept: parts[1] || '',
    category: parts[2] || '',
    subcategory: parts[3] || '',
    definitionSimple: parts[4] || '',
    realExample: parts[5] || '',
    regulation: parts[6] || '',
    videoUrl: parts[8] || ''
  };
});

export const categories = [
  'Derecho Civil',
  'Derecho Penal',
  'Derecho Laboral',
  'Derecho Administrativo',
  'Derecho Constitucional',
  'Derecho Procesal',
  'Derecho Comercial',
  'Derecho de Familia'
];

