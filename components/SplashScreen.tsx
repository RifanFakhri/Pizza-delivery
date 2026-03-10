'use client';

import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface SplashScreenProps {
    onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Since the new animation loops, we'll use a fixed duration for the splash screen
        const timeout = setTimeout(() => {
            handleComplete();
        }, 4000); // 3.5 seconds fixed duration

        return () => clearTimeout(timeout);
    }, []);

    const handleComplete = () => {
        setIsVisible(false);
        if (onComplete) {
            onComplete();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-black transition-opacity duration-500 overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <DotLottieReact
                    src="https://lottie.host/41bc8a97-4cdf-4e9d-a6b6-c8c9c0e369e6/QpQV5PmiJh.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default SplashScreen;
