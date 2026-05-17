import { motion } from 'framer-motion';
const ScrollHint = () => {
    return (<motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
      <span>scroll to continue</span>
      <div className="scroll-line"/>
    </motion.div>);
};
export default ScrollHint;
