"use client";

import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PawPrintIcon, ArrowUpDown } from "lucide-react";

interface Species {
  SpeciesID: number;
  SpeciesName: string;
}

export default function AddSpeciesPage() {
  const [speciesName, setSpeciesName] = useState("");
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [filteredSpecies, setFilteredSpecies] = useState<Species[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Species | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get("http://localhost/petto-san/php/get-species.php")
      .then((response) => {
        if (response.data.success) {
          setSpeciesList(response.data.data);
          setFilteredSpecies(response.data.data);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching species data:", error);
      });
  }, []);

  const handleSort = (column: keyof Species) => {
    const newSortDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedSpecies = [...filteredSpecies].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredSpecies(sortedSpecies);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/petto-san/php/add-species.php",
        {
          speciesName: speciesName,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Species added successfully!",
          variant: "success",
        });

        // Refresh the species list
        setSpeciesList((prevSpeciesList) => [
          ...prevSpeciesList,
          { SpeciesID: response.data.newSpeciesID, SpeciesName: speciesName },
        ]);
        setFilteredSpecies((prevFilteredSpecies) => [
          ...prevFilteredSpecies,
          { SpeciesID: response.data.newSpeciesID, SpeciesName: speciesName },
        ]);
      } else {
        toast({
          title: "Error",
          description: `${response.data.message}`,
          variant: "warning",
        });
      }

      setSpeciesName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the species.",
        variant: "warning",
      });
      console.error("There was an error!", error);
    }
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof Species;
    children: ReactNode;
  }) => (
    <TableHead>
      <button
        className="flex items-center space-x-1 text-left font-medium text-primary-foreground hover:text-primary"
        onClick={() => handleSort(column)}
      >
        <span>{children}</span>
        <ArrowUpDown
          className={`h-4 w-4 ${
            sortColumn === column
              ? sortDirection === "asc"
                ? "text-primary"
                : "text-primary-foreground"
              : "text-muted-foreground"
          }`}
        />
      </button>
    </TableHead>
  );

  return (
    <div className="relative bg-background min-h-screen p-8">
      {/* Background PawPrint Icons */}
      <div className="absolute top-4 right-4 opacity-50 animate-float">
        <PawPrintIcon className="text-secondary h-40 w-40" />
      </div>
      <div className="absolute top-4 left-4 opacity-50 animate-float-slow">
        <PawPrintIcon className="text-accent h-40 w-40" />
      </div>
      <div className="absolute top-60 right-56 opacity-50 animate-float-fast">
        <PawPrintIcon className="text-accent h-40 w-40" />
      </div>
      <div className="absolute bottom-60 left-60 opacity-50 animate-float-slow">
        <PawPrintIcon className="text-secondary h-40 w-40" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-50 animate-float-slow">
        <PawPrintIcon className="text-accent h-40 w-40" />
      </div>

      {/* Card for Adding Species */}
      <Card className="max-w-md mx-auto shadow-lg z-50 hover:shadow-xl transition-shadow duration-300 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary-foreground mb-4">
            Add New Species
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="speciesName" className="text-muted-foreground">
                Species Name
              </Label>
              <Input
                id="speciesName"
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                required
                className="bg-input text-foreground"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Add Species
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table for displaying species */}
      <Card className="max-w-3xl mx-auto shadow-lg z-50 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary-foreground mb-4">
            Species List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="bg-card shadow-md rounded-lg">
            <TableHeader className="bg-muted">
              <TableRow>
                <SortableHeader column="SpeciesID">ID</SortableHeader>
                <SortableHeader column="SpeciesName">
                  Species Name
                </SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody className="text-foreground">
              {filteredSpecies.map((species) => (
                <TableRow key={species.SpeciesID} className="hover:bg-muted">
                  <TableCell className="px-4 py-2">
                    {species.SpeciesID}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {species.SpeciesName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSpecies.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No species found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
