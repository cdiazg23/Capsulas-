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

  const graphData = useMemo(() => {
    // Base nodes that should ALWAYS appear
    const nodes: Node[] = [
      { id: 'root', name: 'Derecho', val: 24, color: '#f59e0b', type: 'root' },
      { id: 'cat-civil', name: 'Derecho Civil', val: 18, color: '#3b82f6', type: 'category' },
      { id: 'cat-procesal', name: 'Derecho Procesal', val: 18, color: '#10b981', type: 'category' }
    ];

    const links: Link[] = [
      { source: 'root', target: 'cat-civil' },
      { source: 'root', target: 'cat-procesal' }
    ];

    // Add concepts
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

    console.log('Graph Data:', { nodes: nodes.length, links: links.length });
    return { nodes, links };
  }, [filteredConcepts]);

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
        <meta name="description" content="Visualización interactiva de conceptos legales." />
      </Helmet>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 fill-1">hub</span>
            Cerebro Digital
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Explora las interconexiones del Derecho en tiempo real.</p>
        </div>

        <div className="flex flex-wrap gap-2 max-w-2xl justify-end">
          {allSubcategories.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                selectedTags.includes(tag)
                  ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-300'
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button 
              onClick={() => setSelectedTags([])}
              className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase px-2"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden relative min-h-[400px]"
      >
        {dimensions.width > 0 && (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            width={dimensions.width}
            height={dimensions.height}
            nodeLabel="name"
            nodeColor={n => (n as any).color}
            nodeRelSize={6}
            linkColor={() => 'rgba(148, 163, 184, 0.3)'}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 14 / globalScale;
              ctx.font = `${fontSize}px Inter, sans-serif`;
              
              // Draw node circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();

              // Border for root
              if (node.type === 'root') {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2 / globalScale;
                ctx.stroke();
              }

              // Text label
              if (globalScale > 1.2 || node.type !== 'concept') {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.type === 'root' ? '#b45309' : (node.type === 'category' ? '#1e40af' : '#475569');
                ctx.fillText(label, node.x, node.y + (node.val + 2));
              }
            }}
            onNodeClick={(node: any) => {
              if (node.data) {
                window.open(`/app/concept/${node.data.id}`, '_blank');
              }
            }}
          />
        )}

        {/* Legend */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl pointer-events-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Leyenda</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-slate-700 dark:text-slate-300">Núcleo (Derecho)</span>
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

        {/* Help Tip */}
        <div className="absolute top-6 right-6 p-4 bg-primary/10 dark:bg-primary/20 backdrop-blur-md rounded-2xl border border-primary/20 shadow-sm pointer-events-none">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-sm">info</span>
            <span className="text-[10px] font-bold uppercase">Arrastra para explorar · Scroll para zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBrain;
