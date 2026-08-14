"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Users, MapPin, MessageSquare, Award } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/scroll-reveal";

interface StatsSectionProps {
  primaryColor?: string;
}

/**
 * AnimatedCounter – Animates a number from 0 to `end` using
 * requestAnimationFrame for smooth 60fps animation.
 * Supports a suffix (e.g. "+", "%").
 */
function AnimatedCounter({
  end,
  suffix = "",
  duration = 2000,
  primaryColor,
}: {
  end: number;
  suffix?: string;
  duration?: number;
  primaryColor: string;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection Observer: trigger animation when the element scrolls into view
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * end);

      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, end, duration]);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  return (
    <div
      ref={ref}
      className="text-3xl font-extrabold tracking-tight mb-1 tabular-nums"
      style={{ color: primaryColor }}
    >
      {count}
      {suffix}
    </div>
  );
}

export function StatsSection({ primaryColor = "#0f766e" }: StatsSectionProps) {
  const stats = [
    {
      id: 1,
      endValue: 5,
      suffix: "+",
      label: "Équipe & Experts",
      description: "Professionnels de santé et chercheurs spécialisés",
      icon: Users,
    },
    {
      id: 2,
      endValue: 7,
      suffix: "+",
      label: "Bureaux RDC",
      description: "Présence régionale et distribution nationale",
      icon: MapPin,
    },
    {
      id: 3,
      endValue: 3,
      suffix: "+",
      label: "Témoignages",
      description: "Études cliniques et retours d'expérience clients",
      icon: MessageSquare,
    },
    {
      id: 4,
      endValue: 100,
      suffix: "%",
      label: "Approuvé par Oqata",
      description: "Normes de qualité et sécurité biologiques strictes",
      icon: Award,
    },
  ];

  return (
    <div className="py-12 my-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <StaggerItem key={stat.id}>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-md transition-transform group-hover:scale-110"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Animated Counter */}
                  <AnimatedCounter
                    end={stat.endValue}
                    suffix={stat.suffix}
                    primaryColor={primaryColor}
                    duration={stat.endValue >= 100 ? 2400 : 1800}
                  />

                  <div className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
