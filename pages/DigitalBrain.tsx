import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchLegalConcepts } from '../data';
import { LegalConcept } from '../types';
import LoadingState from '../components/LoadingState';

// ======================================================================
// Pure Canvas implementation - NO external graph library needed
// ======================================================================

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'root' | 'category' | 'subcategory' | 'concept';
  category?: string;
  subcategory?: string;
  data?: LegalConcept;
}

interface GraphLink {
  source: string;
  target: string;
  color: string;
}

// Color palette
const COLORS = {
  root: '#f59e0b',
  rootBorder: '#d97706',
  civil: '#3b82f6',
  civilLight: '#93c5fd',
  civilBorder: '#2563eb',
  procesal: '#10b981',
  procesalLight: '#6ee7b7',
  procesalBorder: '#059669',
  link: 'rgba(148, 163, 184, 0.25)',
  linkActive: 'rgba(99, 102, 241, 0.6)',
  text: '#334155',
  textLight: '#94a3b8',
  bg: '#f8fafc',
};

const DigitalBrain: React.FC = () => {
  const [concepts, setConcepts] = useState<LegalConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dragNode, setDragNode] = useState<GraphNode | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const animFrameRef = useRef<number>(0);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return concepts.filter(c =>
      (c.category === 'Derecho Civil' || c.category === 'Derecho Procesal') &&
      (selectedTags.length === 0 || selectedTags.includes(c.subcategory))
    );
  }, [concepts, selectedTags]);

  // All subcategories for tag filter
  const allSubcategories = useMemo(() => {
    const subs = new Set(
      concepts
        .filter(c => c.category === 'Derecho Civil' || c.category === 'Derecho Procesal')
        .map(c => c.subcategory)
        .filter(Boolean)
    );
    return Array.from(subs).sort();
  }, [concepts]);

  // Load concepts from supabase
  useEffect(() => {
    fetchLegalConcepts()
      .then(data => setConcepts(data))
      .catch(err => console.error('Error loading concepts:', err))
      .finally(() => setLoading(false));
  }, []);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setCanvasSize({ w: e.contentRect.width, h: e.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Build graph when data or filters change
  useEffect(() => {
    const cx = canvasSize.w / 2;
    const cy = canvasSize.h / 2;
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Root node
    nodes.push({
      id: 'root', label: 'Derecho', x: cx, y: cy,
      vx: 0, vy: 0, radius: 32, color: COLORS.root, type: 'root'
    });

    // Category nodes
    nodes.push({
      id: 'cat-civil', label: 'D. Civil', x: cx - 200, y: cy,
      vx: 0, vy: 0, radius: 24, color: COLORS.civil, type: 'category', category: 'Derecho Civil'
    });
    nodes.push({
      id: 'cat-procesal', label: 'D. Procesal', x: cx + 200, y: cy,
      vx: 0, vy: 0, radius: 24, color: COLORS.procesal, type: 'category', category: 'Derecho Procesal'
    });

    links.push({ source: 'root', target: 'cat-civil', color: COLORS.civil });
    links.push({ source: 'root', target: 'cat-procesal', color: COLORS.procesal });

    // Group concepts by subcategory
    const civilSubs = new Map<string, LegalConcept[]>();
    const procesalSubs = new Map<string, LegalConcept[]>();

    filteredConcepts.forEach(c => {
      const map = c.category === 'Derecho Civil' ? civilSubs : procesalSubs;
      if (!map.has(c.subcategory)) map.set(c.subcategory, []);
      map.get(c.subcategory)!.push(c);
    });

    // Subcategory nodes + concept nodes for Civil
    let civilAngle = -Math.PI / 2;
    const civilStep = Math.PI / Math.max(civilSubs.size, 1);
    civilSubs.forEach((conceptsInSub, subName) => {
      const subId = `sub-civil-${subName}`;
      const dist = 180;
      nodes.push({
        id: subId, label: subName,
        x: cx - 200 + Math.cos(civilAngle) * dist,
        y: cy + Math.sin(civilAngle) * dist,
        vx: 0, vy: 0, radius: 14, color: COLORS.civilLight, type: 'subcategory',
        category: 'Derecho Civil', subcategory: subName
      });
      links.push({ source: 'cat-civil', target: subId, color: 'rgba(59,130,246,0.3)' });

      // Concept nodes
      const cStep = (Math.PI * 0.6) / Math.max(conceptsInSub.length, 1);
      let cAngle = civilAngle - (Math.PI * 0.3);
      conceptsInSub.forEach(concept => {
        const cDist = 100 + Math.random() * 40;
        const parentNode = nodes.find(n => n.id === subId)!;
        nodes.push({
          id: concept.id, label: concept.concept,
          x: parentNode.x + Math.cos(cAngle) * cDist,
          y: parentNode.y + Math.sin(cAngle) * cDist,
          vx: 0, vy: 0, radius: 6, color: COLORS.civilLight, type: 'concept',
          category: 'Derecho Civil', subcategory: subName, data: concept
        });
        links.push({ source: subId, target: concept.id, color: 'rgba(147,197,253,0.2)' });
        cAngle += cStep;
      });

      civilAngle += civilStep;
    });

    // Subcategory + concept nodes for Procesal
    let procesalAngle = -Math.PI / 2;
    const procesalStep = Math.PI / Math.max(procesalSubs.size, 1);
    procesalSubs.forEach((conceptsInSub, subName) => {
      const subId = `sub-procesal-${subName}`;
      const dist = 180;
      nodes.push({
        id: subId, label: subName,
        x: cx + 200 + Math.cos(procesalAngle) * dist,
        y: cy + Math.sin(procesalAngle) * dist,
        vx: 0, vy: 0, radius: 14, color: COLORS.procesalLight, type: 'subcategory',
        category: 'Derecho Procesal', subcategory: subName
      });
      links.push({ source: 'cat-procesal', target: subId, color: 'rgba(16,185,129,0.3)' });

      const cStep = (Math.PI * 0.6) / Math.max(conceptsInSub.length, 1);
      let cAngle = procesalAngle - (Math.PI * 0.3);
      conceptsInSub.forEach(concept => {
        const cDist = 100 + Math.random() * 40;
        const parentNode = nodes.find(n => n.id === subId)!;
        nodes.push({
          id: concept.id, label: concept.concept,
          x: parentNode.x + Math.cos(cAngle) * cDist,
          y: parentNode.y + Math.sin(cAngle) * cDist,
          vx: 0, vy: 0, radius: 6, color: COLORS.procesalLight, type: 'concept',
          category: 'Derecho Procesal', subcategory: subName, data: concept
        });
        links.push({ source: subId, target: concept.id, color: 'rgba(110,231,183,0.2)' });
        cAngle += cStep;
      });

      procesalAngle += procesalStep;
    });

    nodesRef.current = nodes;
    linksRef.current = links;
  }, [filteredConcepts, canvasSize]);

  // Simple force simulation
  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const links = linksRef.current;
    if (!nodes.length) return;

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = (a.radius + b.radius) * 2.5;
        if (dist < minDist) {
          const force = (minDist - dist) / dist * 0.05;
          const fx = dx * force;
          const fy = dy * force;
          if (a.id !== dragNode?.id) { a.vx -= fx; a.vy -= fy; }
          if (b.id !== dragNode?.id) { b.vx += fx; b.vy += fy; }
        }
      }
    }

    // Link attraction
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const idealDist = (source.type === 'root' ? 220 : source.type === 'category' ? 160 : 90);
      const force = (dist - idealDist) / dist * 0.003;
      const fx = dx * force;
      const fy = dy * force;
      if (source.id !== dragNode?.id) { source.vx += fx; source.vy += fy; }
      if (target.id !== dragNode?.id) { target.vx -= fx; target.vy -= fy; }
    });

    // Apply velocities
    nodes.forEach(n => {
      if (n.id === dragNode?.id) return;
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
    });
  }, [dragNode]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes = nodesRef.current;
    const links = linksRef.current;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasSize.w * dpr;
    canvas.height = canvasSize.h * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw links
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) return;

      const isHighlighted = hoveredNode && (link.source === hoveredNode || link.target === hoveredNode);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = isHighlighted ? COLORS.linkActive : link.color;
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isHovered = hoveredNode === node.id;
      const r = isHovered ? node.radius * 1.3 : node.radius;

      // Glow for hovered
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '33';
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Border
      if (node.type === 'root' || node.type === 'category') {
        ctx.strokeStyle = node.type === 'root' ? COLORS.rootBorder : (node.category === 'Derecho Civil' ? COLORS.civilBorder : COLORS.procesalBorder);
        ctx.lineWidth = node.type === 'root' ? 3 : 2;
        ctx.stroke();
      }

      // Label
      if (node.type !== 'concept' || isHovered || zoom > 1.5) {
        const fontSize = node.type === 'root' ? 14 : node.type === 'category' ? 12 : node.type === 'subcategory' ? 10 : 9;
        ctx.font = `${node.type === 'root' || node.type === 'category' ? 'bold ' : ''}${fontSize}px -apple-system, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = isHovered ? '#0f172a' : COLORS.text;

        const labelY = node.y + r + 4;
        const text = node.label.length > 25 ? node.label.slice(0, 22) + '…' : node.label;
        
        // Text background
        const metrics = ctx.measureText(text);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(node.x - metrics.width / 2 - 3, labelY - 1, metrics.width + 6, fontSize + 4);
        
        ctx.fillStyle = isHovered ? '#0f172a' : COLORS.text;
        ctx.fillText(text, node.x, labelY);
      }
    });

    ctx.restore();

    // Run simulation
    simulate();

    animFrameRef.current = requestAnimationFrame(draw);
  }, [canvasSize, zoom, pan, hoveredNode, simulate, dragNode]);

  // Animation loop
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  // Mouse interactions
  const getNodeAt = useCallback((clientX: number, clientY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = (clientX - rect.left - pan.x) / zoom;
    const my = (clientY - rect.top - pan.y) / zoom;

    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const n = nodesRef.current[i];
      const dx = mx - n.x;
      const dy = my - n.y;
      if (dx * dx + dy * dy < (n.radius + 5) * (n.radius + 5)) return n;
    }
    return null;
  }, [pan, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragNode) {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      dragNode.x = (e.clientX - rect.left - pan.x) / zoom;
      dragNode.y = (e.clientY - rect.top - pan.y) / zoom;
      dragNode.vx = 0;
      dragNode.vy = 0;
      return;
    }
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    const node = getNodeAt(e.clientX, e.clientY);
    setHoveredNode(node?.id || null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = node ? 'pointer' : 'grab';
    }
  }, [dragNode, isPanning, panStart, getNodeAt, pan, zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = getNodeAt(e.clientX, e.clientY);
    if (node) {
      setDragNode(node);
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    }
  }, [getNodeAt]);

  const handleMouseUp = useCallback(() => {
    if (dragNode) {
      setDragNode(null);
    }
    setIsPanning(false);
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  }, [dragNode]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const node = getNodeAt(e.clientX, e.clientY);
    if (node?.data) {
      window.open(`/app/concept/${node.data.id}`, '_blank');
    }
  }, [getNodeAt]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.2), 5));
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) return <LoadingState />;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      <Helmet>
        <title>Cerebro Digital | Iuris Academy</title>
        <meta name="description" content="Visualización interactiva de conceptos legales." />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 fill-1">hub</span>
            Cerebro Digital
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Explora las interconexiones del Derecho · {filteredConcepts.length} conceptos
          </p>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1.5 max-w-3xl justify-end">
          {allSubcategories.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                selectedTags.includes(tag)
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase px-2 transition-colors"
            >
              ✕ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        ref={containerRef}
        className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"
        style={{ minHeight: '400px' }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: canvasSize.w, height: canvasSize.h, display: 'block', cursor: 'grab' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg pointer-events-none">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Leyenda</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-amber-600"></div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">Núcleo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-600"></div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">D. Civil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-600"></div>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">D. Procesal</span>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg overflow-hidden">
            <button onClick={() => setZoom(z => Math.min(z * 1.3, 5))} className="px-3 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold">+</button>
            <div className="border-t border-slate-200 dark:border-slate-700"></div>
            <button onClick={() => setZoom(z => Math.max(z / 1.3, 0.2))} className="px-3 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold">−</button>
          </div>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg text-slate-500 hover:text-primary text-[10px] font-bold uppercase transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Hint */}
        <div className="absolute top-4 left-4 p-2.5 bg-indigo-50/80 dark:bg-indigo-950/30 backdrop-blur-sm rounded-lg border border-indigo-100/60 dark:border-indigo-900/40 pointer-events-none">
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Arrastra nodos · Scroll = Zoom · Click = Detalle</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalBrain;
