"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrintIcon, UsersIcon, DogIcon, CatIcon } from "lucide-react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// ... (keep the existing interfaces)

// Define interfaces for the data structure
interface Totals {
  totalPets: number;
  totalOwners: number;
  totalBreeds: number;
  totalSpecies: number;
}

interface Pet {
  id: number;
  name: string;
  count: number;
}

interface Breed {
  id: number;
  name: string;
  count: number;
}

interface Owner {
  id: number;
  name: string;
  petCount: number;
}

interface Leaderboards {
  popularPets: Pet[];
  popularBreeds: Breed[];
  topOwners: Owner[];
}
export default function DashboardPage() {
  const [totals, setTotals] = useState<Totals>({
    totalPets: 0,
    totalOwners: 0,
    totalBreeds: 0,
    totalSpecies: 0,
  });

  const [leaderboards, setLeaderboards] = useState<Leaderboards>({
    popularPets: [],
    popularBreeds: [],
    topOwners: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalsResponse, leaderboardsResponse] = await Promise.all([
          axios.get("http://localhost/petto-san/php/get_dashboard_totals.php"),
          axios.get("http://localhost/petto-san/php/get_leaderboards.php"),
        ]);

        if (totalsResponse.data.success) {
          setTotals(totalsResponse.data.data);
        } else {
          console.error(totalsResponse.data.message);
        }

        if (leaderboardsResponse.data.success) {
          setLeaderboards(leaderboardsResponse.data.data);
        } else {
          console.error(leaderboardsResponse.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const leaderboardTitles = ["Popular Pets", "Popular Breeds", "Top Owners"];

  interface TotalCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
  }

  const TotalCard = ({ title, value, icon: Icon }: TotalCardProps) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pet Hall</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalCard
          title="Total Pets"
          value={totals.totalPets}
          icon={PawPrintIcon}
        />
        <TotalCard
          title="Total Owners"
          value={totals.totalOwners}
          icon={UsersIcon}
        />
        <TotalCard
          title="Total Breeds"
          value={totals.totalBreeds}
          icon={DogIcon}
        />
        <TotalCard
          title="Total Species"
          value={totals.totalSpecies}
          icon={CatIcon}
        />
      </div>

      <div className="bg-[color:var(--card)] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Leaderboards</h2>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {leaderboardTitles.map((title, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="min-h-[400px]">
                      <CardHeader>
                        <CardTitle className="text-center text-foreground">
                          {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <ScrollArea className="h-[280px]">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px] text-foreground">
                                  Rank
                                </TableHead>
                                <TableHead className="text-foreground">
                                  Name
                                </TableHead>
                                <TableHead className="text-right text-foreground">
                                  Count
                                </TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {index === 0 &&
                                leaderboards.popularPets.map((pet, idx) => (
                                  <TableRow key={pet.id}>
                                    <TableCell className="font-medium text-foreground">
                                      {idx + 1}
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                      {pet.name}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                      {pet.count}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              {index === 1 &&
                                leaderboards.popularBreeds.map((breed, idx) => (
                                  <TableRow key={breed.id}>
                                    <TableCell className="font-medium text-foreground">
                                      {idx + 1}
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                      {breed.name}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                      {breed.count}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              {index === 2 &&
                                leaderboards.topOwners.map((owner, idx) => (
                                  <TableRow key={owner.id}>
                                    <TableCell className="font-medium text-foreground">
                                      {idx + 1}
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                      {owner.name}
                                    </TableCell>
                                    <TableCell className="text-right text-foreground">
                                      {owner.petCount}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </ScrollArea>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </div>
  );
}
