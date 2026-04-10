import React, { useState, useEffect, useMemo, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Helmet } from 'react-helmet-async';
import { fetchLegalConcepts } from '../data';
import { LegalConcept } from '../types';
import LoadingState from '../components/LoadingState';

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
  type: 'root' | 'category' | 'concept';
  data?: LegalConcept;
}

interface Link {
  source: string;
  target: string;
}

const DigitalBrain: React.FC = () => {
  const [concepts, setConcepts] = useState<LegalConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Filter only Civil and Procesal as requested
  const filteredConcepts = useMemo(() => {
    return concepts.filter(c => 
      (c.category === 'Derecho Civil' || c.category === 'Derecho Procesal') &&
      (selectedTags.length === 0 || selectedTags.includes(c.subcategory))
    );
  }, [concepts, selectedTags]);

  const allSubcategories = useMemo(() => {
    const subs = Array.from(new Set(concepts
      .filter(c => c.category === 'Derecho Civil' || c.category === 'Derecho Procesal')
      .map(c => c.subcategory)));
    return subs.sort();
  }, [concepts]);

  useEffect(() => {
    const loadConcepts = async () => {
      try {
        const data = await fetchLegalConcepts();
        setConcepts(data);
      } catch (error) {
        console.error('Error loading concepts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConcepts();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    // Force stabilization
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-150);
      graphRef.current.d3Force('link').distance(100);
    }
  }, [dimensions, loading]);

  const graphData = useMemo(() => {
    const nodes: Node[] = [
      { id: 'root', name: 'Derecho', val: 24, color: '#f59e0b', type: 'root' },
      { id: 'cat-civil', name: 'Derecho Civil', val: 18, color: '#3b82f6', type: 'category' },
      { id: 'cat-procesal', name: 'Derecho Procesal', val: 18, color: '#10b981', type: 'category' }
    ];

    const links: Link[] = [
      { source: 'root', target: 'cat-civil' },
      { source: 'root', target: 'cat-procesal' }
    ];

    filteredConcepts.forEach(concept => {
      const categoryId = concept.category === 'Derecho Civil' ? 'cat-civil' : 'cat-procesal';
      nodes.push({
        id: concept.id,
        name: concept.concept,
        val: 10,
        color: concept.category === 'Derecho Civil' ? '#93c5fd' : '#a7f3d0',
        type: 'concept',
        data: concept
      });
      links.push({ source: categoryId, target: concept.id });
    });

    return { nodes, links };
  }, [filteredConcepts]);

  const testData = {
    nodes: [
      { id: 'root', name: 'Derecho' },
      { id: 'cat-civil', name: 'Derecho Civil' },
      { id: 'cat-procesal', name: 'Derecho Procesal' }
    ],
    links: [
      { source: 'root', target: 'cat-civil' },
      { source: 'root', target: 'cat-procesal' }
    ]
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) return <LoadingState />;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      <Helmet>
        <title>Cerebro Digital | Iuris Academy</title>
      </Helmet>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 fill-1">hub</span>
            Cerebro Digital
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Explora las interconexiones del Derecho.</p>
        </div>

        <div className="flex flex-wrap gap-2 max-w-2xl justify-end">
          {allSubcategories.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button 
              onClick={() => setSelectedTags([])}
              className="text-[10px] text-slate-400 font-bold uppercase hover:text-red-500 ml-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden relative"
        style={{ minHeight: '500px' }}
      >
        {dimensions.width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData.nodes.length > 3 ? graphData : testData}
            width={dimensions.width}
            height={dimensions.height}
            nodeLabel="name"
            nodeRelSize={8}
            nodeAutoColorBy="type"
            linkDirectionalParticles={1}
            linkDirectionalParticleSpeed={0.005}
            linkColor={() => 'rgba(148, 163, 184, 0.4)'}
            onNodeClick={(node: any) => {
              if (node.data?.id) {
                window.open(`/app/concept/${node.data.id}`, '_blank');
              }
            }}
          />
        )}

        {/* Legend */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl pointer-events-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Leyenda</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-slate-700 dark:text-slate-300">Núcleo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-700 dark:text-slate-300">D. Civil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-slate-700 dark:text-slate-300">D. Procesal</span>
          </div>
        </div>

        {/* Debug (invisible but present) */}
        <div className="absolute top-2 left-2 opacity-0">
          State: {graphData.nodes.length} nodes
        </div>
      </div>
    </div>
  );
};

export default DigitalBrain;
