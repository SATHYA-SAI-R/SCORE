import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
const FloatingNodes = () => {
    const [nodes, setNodes] = useState([]);
    useEffect(() => {
        const generated = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60,
            delay: i * 0.2,
        }));
        setNodes(generated);
    }, []);
    return (<div className="absolute inset-0 pointer-events-none overflow-hidden">
      {nodes.map((node) => (<motion.div key={node.id} className="absolute w-1 h-1 rounded-full bg-foreground/30" style={{ left: `${node.x}%`, top: `${node.y}%` }} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: node.delay, duration: 0.5 }} animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.5, 1],
            }}/>))}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.slice(0, -1).map((node, i) => {
            const next = nodes[i + 1];
            if (!next)
                return null;
            return (<motion.line key={`line-${node.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${next.x}%`} y2={`${next.y}%`} stroke="hsl(var(--foreground))" strokeOpacity={0.1} strokeWidth={0.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15, duration: 1 }}/>);
        })}
      </svg>
    </div>);
};
export default FloatingNodes;
