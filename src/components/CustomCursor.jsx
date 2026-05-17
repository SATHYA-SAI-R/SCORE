import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const [cursorVariant, setCursorVariant] = useState("default");

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Slower follow speed: Lower stiffness = "heavier"/slower lag. High damping = no bounce.
    // Previous: stiffness: 100, damping: 25
    const springConfig = { damping: 30, stiffness: 50, mass: 1 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const mouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        };
    }, [mouseX, mouseY]);

    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target;

            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("cursor-hover") ||
                target.dataset.cursor === "hover"
            ) {
                setCursorVariant("hover");
            } else if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.classList.contains("cursor-text") ||
                target.dataset.cursor === "text"
            ) {
                setCursorVariant("text");
            } else {
                setCursorVariant("default");
            }
        };

        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <>
            {/* 1. Core Dot: Bigger now (12px), follows immediately */}
            <motion.div
                className="fixed top-0 left-0 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={{
                    default: { height: 12, width: 12, opacity: 1 },
                    hover: { height: 8, width: 8, opacity: 0.5 },
                    text: { height: 24, width: 4, borderRadius: 0, opacity: 1 }
                }}
                animate={cursorVariant}
                transition={{ duration: 0.1 }}
            />

            {/* 2. Fluid Orbit: Slower follow speed */}
            <motion.div
                className="fixed top-0 left-0 border border-primary rounded-full pointer-events-none z-[9998] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={{
                    default: { height: 40, width: 40, opacity: 0.6, borderWidth: "1px" },
                    hover: { height: 80, width: 80, opacity: 1, borderWidth: "2px", backgroundColor: "rgba(255,255,255,0.05)" },
                    text: { height: 40, width: 40, opacity: 0, scale: 0 }
                }}
                animate={cursorVariant}
            />
        </>
    );
};

export default CustomCursor;
