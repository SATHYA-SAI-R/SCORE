import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
const AnimatedText = ({ children, className = '', delay = 0, splitBy = 'words' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10%' });
    const elements = splitBy === 'chars'
        ? children.split('')
        : children.split(' ');
    return (<span ref={ref} className={`inline-block ${className}`}>
      {elements.map((element, index) => (<motion.span key={index} className="inline-block" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{
                duration: 0.6,
                delay: delay + index * (splitBy === 'chars' ? 0.02 : 0.08),
                ease: [0.22, 1, 0.36, 1],
            }}>
          {element}{splitBy === 'words' ? '\u00A0' : ''}
        </motion.span>))}
    </span>);
};
export default AnimatedText;
