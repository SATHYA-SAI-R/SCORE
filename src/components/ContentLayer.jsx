import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
const ContentLayer = ({ children, className = '', id }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-20%' });
    return (<motion.section ref={ref} id={id} className={`content-layer ${className}`} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.section>);
};
export default ContentLayer;
