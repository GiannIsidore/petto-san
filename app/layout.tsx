import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import {
  PawPrintIcon,
  UsersIcon,
  DogIcon,
  CatIcon,
  ListIcon,
  Dog,
  Menu,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const metadata: Metadata = {
  title: "PetPals System",
  description: "Comprehensive pet management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen lg:flex-row">
            <header className="lg:hidden flex justify-between items-center p-4 bg-card shadow-md">
              <div className="flex items-center space-x-2">
                <Dog size={24} className="text-primary" />
                <span className="text-xl font-bold text-primary">
                  PetPals Hub
                </span>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <nav className="mt-5">
                    <SidebarContent />
                  </nav>
                </SheetContent>
              </Sheet>
            </header>
            <aside className="hidden lg:block w-64 bg-card shadow-2xl">
              <nav className="mt-5">
                <SidebarContent />
              </nav>
            </aside>
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-background text-foreground">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function SidebarContent() {
  return (
    <>
      <div className="flex items-center justify-center space-x-2 py-7">
        <Dog size={24} className="text-primary" />
        <span className="text-xl font-bold text-primary">PetPals System</span>
        <ModeToggle />
      </div>
      <NavLink href="/dashboard" icon={<PawPrintIcon />} label="Dashboard" />
      <NavLink
        href="/dashboard/add-species"
        icon={<CatIcon />}
        label="Add Species"
      />
      <NavLink
        href="/dashboard/add-breed"
        icon={<DogIcon />}
        label="Add Breed"
      />
      <NavLink
        href="/dashboard/add-owner"
        icon={<UsersIcon />}
        label="Add Owner"
      />
      <NavLink
        href="/dashboard/add-pet"
        icon={<PawPrintIcon />}
        label="Add Pet"
      />
      <NavLink href="/dashboard/pets" icon={<ListIcon />} label="View Pets" />
    </>
  );
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center py-2 px-4 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
}
