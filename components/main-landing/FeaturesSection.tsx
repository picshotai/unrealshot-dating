"use client"; 

import { Shield, Palette, Zap, Sparkles, SlidersHorizontal, FileText } from 'lucide-react'; 
import { motion } from 'framer-motion'; 
import { FeatureCard } from '@/components/ui/grid-feature-cards'; 

const features = [ 
	 { 
	 	 title: "Looks like a camera roll", 
	 	 icon: Shield, 
	 	 description: "Natural compositions, candid moments and multiple frames from the same setting.", 
	 }, 
	 { 
	 	 title: "15 different shoots", 
	 	 icon: Palette, 
	 	 description: "Enough variety for your opener, full-body photo, lifestyle shots and conversation starters.", 
	 }, 
	 { 
	 	 title: "No prompt engineering", 
	 	 icon: Zap, 
	 	 description: "You answer three simple questions. We handle the shot planning.", 
	 }, 
	 { 
	 	 title: "Your interests matter", 
	 	 icon: Sparkles, 
	 	 description: "Choose what you actually do so your photos don't invent a personality for you.", 
	 }, 
	 { 
	 	 title: "Photo Retakes included", 
	 	 icon: SlidersHorizontal, 
	 	 description: "15 Photo Retakes are included so you can regenerate any individual photo that doesn't feel right.", 
	 }, 
	 { 
	 	 title: "One person throughout", 
	 	 icon: FileText, 
	 	 description: "Your photos are built around the same identity instead of generating a new version of you every time.", 
	 }, 
]; 

export function FeaturesSection() { 
	 return ( 
	 	 <section id="features" className="py-16 md:py-20 bg-[#111111]"> 
	 	 	 <div className="mx-auto w-full max-w-6xl space-y-8 px-4"> 
	 	 	 	 <div className="mx-auto max-w-3xl text-center mb-12"> 
	 	 	 	 	 <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6"> 
	 	 	 	 	 	 Built for dating profiles. <br /> 
	 	 	 	 	 	 <span className="text-[#ff6f00]">Not LinkedIn.</span> 
	 	 	 	 	 </h2> 
	 	 	 	 	 <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-tight"> 
	 	 	 	 	 	UnrealShot is built from the ground up to give your profile the coherent, authentic camera roll it should have had.
	 	 	 	 	 </p> 
	 	 	 	 </div> 

	 	 	 	 <div 
				
				className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed border-gray-600/30 sm:grid-cols-2 md:grid-cols-3"
	 	 	 	 > 
	 	 	 	 	 {features.map((feature, i) => ( 
	 	 	 	 	 	 <FeatureCard key={i} feature={feature} /> 
	 	 	 	 	 ))} 
	 	 	 	 </div> 
	 	 	 </div> 
	 	 </section> 
	 ); 
} 

type ViewAnimationProps = { 
	 delay?: number; 
	 className?: React.ComponentProps<typeof motion.div>['className']; 
	 children: React.ReactNode; 
}; 

