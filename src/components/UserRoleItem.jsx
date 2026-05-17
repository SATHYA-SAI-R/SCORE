import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const UserRoleItem = ({ role, description, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (<motion.div className="flex items-center gap-6 cursor-pointer" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.span className="text-headline font-light" animate={{ opacity: isHovered ? 1 : 0.6 }} transition={{ duration: 0.3 }}>
        {role}
      </motion.span>
      
      <AnimatePresence>
        {isHovered && (<motion.span className="text-muted-foreground text-sm font-light" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            {description}
          </motion.span>)}
      </AnimatePresence>
    </motion.div>);
};
export default UserRoleItem;
