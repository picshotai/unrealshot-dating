import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="py-12 px-8 border-t border-foreground/10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h3 className="font-display text-2xl font-bold uppercase mb-2">UnrealShot AI</h3>
                    <p className="font-mono text-xs text-foreground/40">
                        © 2025 UnrealShot AI. <br />
                        DESIGNED FOR DATING APPS.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2 font-mono text-xs text-foreground/60">
                    <a href="/use-case/couple-photos" className="hover:text-accent uppercase">Couple Photos</a>
                    <a href="/use-case/dating-photos" className="hover:text-accent uppercase">Dating Photos</a>
                    <a href="/use-case/creative-headshots" className="hover:text-accent uppercase">Creative Headshots</a>
                    <a href="/privacy-policy" className="hover:text-accent uppercase">Privacy</a>
                    <a href="/terms" className="hover:text-accent uppercase">Terms</a>
                    <a href="/refund-policy" className="hover:text-accent uppercase">Refund</a>
                    <a href="/blog" className="hover:text-accent uppercase">Blog</a>
                    <a href="https://twitter.com/unrealshotai" className="hover:text-accent uppercase">Twitter</a>
                </div>
            </div>
        </footer>
    );
};