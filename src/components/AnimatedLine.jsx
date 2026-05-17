import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
const AnimatedLine = ({ direction = 'horizontal', className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });
    if (direction === 'horizontal') {
        return (<motion.div ref={ref} className={`h-px bg-foreground/20 ${className}`} initial={{ scaleX: 0, originX: 0 }} animate={isInView ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}/>);
    }
    return (<motion.div ref={ref} className={`w-px bg-foreground/20 ${className}`} initial={{ scaleY: 0, originY: 0 }} animate={isInView ? { scaleY: 1 } : { scaleY: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}/>);
};
export default AnimatedLine;
