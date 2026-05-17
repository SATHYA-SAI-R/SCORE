import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import NoiseOverlay from '@/components/NoiseOverlay';
import ContentLayer from '@/components/ContentLayer';
import AnimatedText from '@/components/AnimatedText';
import VerticalText from '@/components/VerticalText';
import ScrollHint from '@/components/ScrollHint';
import UserRoleItem from '@/components/UserRoleItem';
import AnimatedLine from '@/components/AnimatedLine';
import FloatingNodes from '@/components/FloatingNodes';
import CTAButtons from '@/components/CTAButtons';
const Index = () => {
    const [isLoading, setIsLoading] = useState(true);
    return (<>
      <AnimatePresence mode="wait">
        {isLoading && (<LoadingScreen onComplete={() => setIsLoading(false)}/>)}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (<motion.main className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <NoiseOverlay />
            <VerticalText position="left">BUILT FOR STUDENTS</VerticalText>
            <VerticalText position="right">TRUST LAYER ACTIVE</VerticalText>

            {/* Layer 1: Opening Statement */}
            <ContentLayer className="min-h-screen">
              <div className="max-w-5xl">
                <motion.span className="text-micro block mb-6 text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
                  STUDENTS_CORE — VERIFIED STUDENT NETWORK
                </motion.span>
                
                <h1 className="text-display mb-8">
                  <AnimatedText delay={0.4}>Students deserve real work.</AnimatedText>
                </h1>
                
                <motion.p className="text-muted-foreground text-lg md:text-xl font-light max-w-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  Not unpaid. Not unverified. Not invisible.
                </motion.p>
              </div>
              
              <ScrollHint />
            </ContentLayer>

            {/* Layer 2: Context - The Problem */}
            <ContentLayer>
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                <div>
                  <h2 className="text-headline">
                    <AnimatedText>The problem isn't talent.</AnimatedText>
                  </h2>
                </div>
                
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    It's noise, fake profiles, and zero trust on existing platforms. 
                    Students get lost in a sea of unverified claims. Recruiters waste 
                    hours filtering through uncertainty.
                  </p>
                </motion.div>
              </div>
              
              <AnimatedLine className="w-full mt-24"/>
            </ContentLayer>

            {/* Layer 3: Trust - Verification */}
            <ContentLayer>
              <div className="max-w-4xl">
                <motion.span className="text-micro block mb-6 text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  VERIFICATION PROTOCOL
                </motion.span>
                
                <h2 className="text-headline mb-8">
                  <AnimatedText>Trust is not optional.</AnimatedText>
                </h2>
                
                <div className="space-y-4">
                  <motion.p className="text-foreground/80 font-light text-lg" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}>
                    Every student is verified using a college-issued email ID.
                  </motion.p>
                  
                  <motion.p className="text-foreground/80 font-light text-lg" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
                    Every recruiter is accountable.
                  </motion.p>
                </div>
              </div>

              {/* Trust animation - subtle locking lines */}
              <motion.div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <motion.line x1="0" y1="50" x2="200" y2="50" stroke="hsl(var(--foreground))" strokeOpacity={0.2} strokeWidth={0.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1 }}/>
                  <motion.line x1="0" y1="100" x2="200" y2="100" stroke="hsl(var(--foreground))" strokeOpacity={0.2} strokeWidth={0.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1 }}/>
                  <motion.line x1="0" y1="150" x2="200" y2="150" stroke="hsl(var(--foreground))" strokeOpacity={0.2} strokeWidth={0.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 1.2, duration: 1 }}/>
                  <motion.circle cx="100" cy="100" r="3" fill="hsl(var(--foreground))" fillOpacity={0.4} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.4, duration: 0.4 }}/>
                </svg>
              </motion.div>
            </ContentLayer>

            {/* Layer 4: Student Power - Skills */}
            <ContentLayer>
              <FloatingNodes />
              
              <div className="max-w-4xl relative z-10">
                <h2 className="text-headline mb-6">
                  <AnimatedText>Your skills become signals.</AnimatedText>
                </h2>
                
                <motion.p className="text-muted-foreground font-light text-lg max-w-xl" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
                  Projects. Experience. Proof of work.
                </motion.p>
              </div>
            </ContentLayer>

            {/* Layer 5: AI Matching */}
            <ContentLayer>
              <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
                <div>
                  <motion.span className="text-micro block mb-6 text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                    INTELLIGENT MATCHING
                  </motion.span>
                  
                  <h2 className="text-headline mb-6">
                    <AnimatedText>Opportunities find you.</AnimatedText>
                  </h2>
                  
                  <motion.p className="text-muted-foreground font-light max-w-md" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
                    Our AI matches students to work based on real skills, not keywords.
                  </motion.p>
                </div>
                
                {/* Flowing connection lines */}
                <motion.div className="relative h-48" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}>
                  <svg className="w-full h-full" viewBox="0 0 300 150">
                    {[0, 1, 2, 3].map((i) => (<motion.path key={i} d={`M 0 ${30 + i * 30} Q 150 ${60 + (i % 2) * 30} 300 ${30 + i * 30}`} stroke="hsl(var(--foreground))" strokeOpacity={0.15 - i * 0.03} strokeWidth={0.5} fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.2, duration: 1.5, ease: "easeOut" }}/>))}
                  </svg>
                </motion.div>
              </div>
            </ContentLayer>

            {/* Layer 6: Alumni Mentorship */}
            <ContentLayer>
              <div className="max-w-4xl">
                <h2 className="text-headline mb-6">
                  <AnimatedText>Those ahead, guide those behind.</AnimatedText>
                </h2>
                
                <motion.p className="text-muted-foreground font-light text-lg max-w-xl" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
                  Alumni mentor juniors. Growth becomes collective.
                </motion.p>
              </div>

              {/* Connection threads */}
              <motion.div className="mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 1 }}>
                <div className="flex gap-8">
                  {[1, 2, 3, 4, 5].map((i) => (<motion.div key={i} className="w-px h-16 bg-gradient-to-b from-foreground/30 to-transparent" initial={{ scaleY: 0, originY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}/>))}
                </div>
              </motion.div>
            </ContentLayer>

            {/* Layer 7: Platform Scope */}
            <ContentLayer>
              <div className="max-w-4xl">
                <h2 className="text-headline mb-12">
                  <AnimatedText>Freelance. Intern. Get hired.</AnimatedText>
                </h2>
                
                <div className="space-y-4 ml-1">
                  {['Freelancing tasks', 'Internships', 'Entry-level jobs'].map((item, i) => (<motion.div key={item} className="flex items-center gap-4 text-muted-foreground" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                      <span className="text-foreground/30">–</span>
                      <span className="font-light">{item}</span>
                    </motion.div>))}
                </div>
              </div>
            </ContentLayer>

            {/* Layer 8: User Roles */}
            <ContentLayer>
              <div className="max-w-4xl">
                <motion.span className="text-micro block mb-12 text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  WHO IS THIS FOR
                </motion.span>
                
                <div className="space-y-6">
                  <UserRoleItem role="STUDENT" description="Build your portfolio. Get verified. Find real work." delay={0.1}/>
                  <UserRoleItem role="RECRUITER" description="Access vetted talent. Zero noise. Pure signal." delay={0.2}/>
                  <UserRoleItem role="ALUMNI" description="Give back. Mentor the next generation." delay={0.3}/>
                </div>
              </div>
            </ContentLayer>

            {/* Layer 9: Emotional Value */}
            <ContentLayer>
              <div className="max-w-4xl">
                <h2 className="text-display mb-6">
                  <AnimatedText>Your early career matters.</AnimatedText>
                </h2>
                
                <motion.p className="text-muted-foreground font-light text-xl" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 0.6 }}>
                  This is where it starts.
                </motion.p>
              </div>
            </ContentLayer>

            {/* Layer 10: Call to Action */}
            <ContentLayer className="min-h-screen">
              <div className="max-w-4xl">
                <motion.span className="text-micro block mb-8 text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  JOIN THE NETWORK
                </motion.span>
                
                <h2 className="text-headline mb-4">
                  <AnimatedText>Join the network.</AnimatedText>
                </h2>
                
                <CTAButtons />
              </div>

              {/* Footer micro-text */}
              <motion.div className="absolute bottom-12 left-6 md:left-24 text-nano" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1 }}>
                <span>STUDENTS_CORE © 2026</span>
              </motion.div>
              
              <motion.div className="absolute bottom-12 right-6 md:right-24 text-nano" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }}>
                <span>VERIFIED STUDENT NETWORK</span>
              </motion.div>
            </ContentLayer>
          </motion.main>)}
      </AnimatePresence>
    </>);
};
export default Index;
