import { motion } from 'framer-motion';
const VerticalText = ({ children, position, className = '' }) => {
    return (<motion.span className={`
        fixed text-nano text-vertical pointer-events-none select-none
        ${position === 'left' ? 'left-6 top-1/2 -translate-y-1/2' : 'right-6 top-1/2 -translate-y-1/2'}
        ${className}
      `} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
      {children}
    </motion.span>);
};
export default VerticalText;
