import { ethers } from 'ethers';

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(wei: string): string {
  return parseFloat(ethers.formatEther(wei)).toFixed(4);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}