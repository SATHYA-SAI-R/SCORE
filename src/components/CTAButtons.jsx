import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CTAButtons = () => {
    const navigate = useNavigate();

    return (<motion.div className="flex flex-col sm:flex-row gap-4 mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.button
            className="text-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/student')}
        >
            Start
        </motion.button>
    </motion.div>);
};
export default CTAButtons;
