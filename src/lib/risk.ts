import { ShieldAlert, ShieldCheck, ShieldQuestion, ShieldX, type LucideIcon } from 'lucide-react';
import type { RiskLevel } from '@/types/models';

export interface LevelStyle {
  icon: LucideIcon;
  label: string;
  fg: string;      // text class
  bg: string;      // soft bg class
  ring: string;    // stroke colour (hex) for SVG
  border: string;
  hex: string;
}

export const LEVEL: Record<RiskLevel, LevelStyle> = {
  LOW: { icon: ShieldCheck, label: 'Low risk', fg: 'text-safe', bg: 'bg-safe-bg', border: 'border-safe/30', ring: '#15803D', hex: '#15803D' },
  SUSPICIOUS: { icon: ShieldQuestion, label: 'Suspicious', fg: 'text-warn', bg: 'bg-warn-bg', border: 'border-warn/30', ring: '#B45309', hex: '#B45309' },
  HIGH: { icon: ShieldAlert, label: 'High risk', fg: 'text-high', bg: 'bg-high-bg', border: 'border-high/30', ring: '#C2410C', hex: '#C2410C' },
  CRITICAL: { icon: ShieldX, label: 'Critical risk', fg: 'text-critical', bg: 'bg-critical-bg', border: 'border-critical/30', ring: '#B91C1C', hex: '#B91C1C' },
};

export const EASE = [0.22, 1, 0.36, 1] as const;
