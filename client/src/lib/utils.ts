import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBrowniePoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return points.toLocaleString();
}

export function getTierName(tier: number): string {
  const tiers = {
    1: "Dragon Egg",
    2: "Young Dragon", 
    3: "Mountain Dragon",
    4: "Thunder Dragon",
    5: "Celestial Dragon"
  };
  return tiers[tier as keyof typeof tiers] || "Unknown Tier";
}

export function getTierBenefits(tier: number): string[] {
  const benefits = {
    1: ["Basic marketplace access", "Cultural quiz participation"],
    2: ["Priority job applications", "10% marketplace discount"],
    3: ["Government service priority", "15% marketplace discount", "Exclusive cultural content"],
    4: ["Premium mini-apps access", "20% marketplace discount", "Business fast-track approval"],
    5: ["VIP support", "25% marketplace discount", "Early access to new features", "Cultural ambassador status"]
  };
  return benefits[tier as keyof typeof benefits] || [];
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text-green-600 bg-green-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'rejected':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function generateNftId(): string {
  return `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMockWalletAddress(): string {
  return `0x${Math.random().toString(16).substr(2, 40)}`;
}
