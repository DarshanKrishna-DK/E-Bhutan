import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Residency", href: "/residency" },
    { name: "Jobs", href: "/jobsearch" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Cultural", href: "/cultural" },
    { name: "Government", href: "/government" },
  ];

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  // Silent check for previously connected wallet (NO POPUP)
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        })
        .catch((err: any) => {
          console.error("Error checking wallet connection:", err);
        });
    }
  }, []);

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "transition-colors hover:text-primary",
            location === item.href
              ? "text-primary font-semibold"
              : "text-gray-700",
            mobile && "block py-2 text-lg"
          )}
          onClick={() => mobile && setIsOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-white shadow-lg border-b-4 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bhutan-gradient rounded-lg flex items-center justify-center">
              <Mountain className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-foreground">Digital Bhutan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-9">
            <NavLinks />
            <Button onClick={connectWallet}>
              {walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavLinks mobile />
                  <Button className="w-full justify-start" onClick={connectWallet}>
                    {walletAddress
                      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                      : "Connect Wallet"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}