"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrintIcon, ArrowUpDown } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Species {
  SpeciesID: number;
  SpeciesName: string;
}

interface Breeds {
  BreedID: number;
  BreedName: string;
  SpeciesName: string;
}

export default function AddBreedPage() {
  const [breedName, setBreedName] = useState("");
  const [speciesId, setSpeciesId] = useState<string>("");
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breeds[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breeds[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Breeds | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get("http://localhost/petto-san/php/get_breed.php")
      .then((response) => {
        if (response.data.success) {
          setBreeds(response.data.data);
          setFilteredBreeds(response.data.data);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the breeds!", error);
      });

    axios
      .get("http://localhost/petto-san/php/get-species.php")
      .then((response) => {
        if (response.data.success) {
          setSpeciesList(response.data.data);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the species!", error);
      });
  }, []);

  const handleSort = (column: keyof Breeds) => {
    const newSortDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedBreeds = [...filteredBreeds].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredBreeds(sortedBreeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/petto-san/php/add-breed.php",
        {
          breedName: breedName,
          speciesId: speciesId,
        }
      );

      if (response.data.success) {
        toast({
          title: "YEHEY(～￣▽￣)～",
          description: "New Breed Added 🐶",
          variant: "success",
        });
        setBreedName("");
        setSpeciesId("");

        // Refresh the breed list
        axios
          .get("http://localhost/petto-san/php/get_breed.php")
          .then((response) => {
            if (response.data.success) {
              setBreeds(response.data.data);
              setFilteredBreeds(response.data.data);
            } else {
              console.error(response.data.message);
            }
          });
      } else {
        toast({
          title: "oh nooo.... (´。＿。｀)",
          description: `${response.data.message} 😭`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the breed.",
        variant: "destructive",
      });
      console.error("There was an error!", error);
    }
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof Breeds;
    children: React.ReactNode;
  }) => (
    <th className="px-4 py-2">
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
    </th>
  );

  return (
    <div className="relative bg-background min-h-screen p-8">
      {/* Floating Paw Print Icons */}
      <div className="absolute top-4 left-3 opacity-50 animate-float-fast">
        <PawPrintIcon className="text-secondary h-40 w-40" />
      </div>
      <div className="absolute bottom-10 right-4 opacity-50 animate-float-slow">
        <PawPrintIcon className="text-accent h-40 w-40" />
      </div>

      <Card className="max-w-lg mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card rounded-lg ">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary-foreground mb-6">
            Add New Breed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="breedName" className="text-secondary-foreground">
                Breed Name
              </Label>
              <Input
                id="breedName"
                value={breedName}
                onChange={(e) => setBreedName(e.target.value)}
                required
                className="bg-input text-foreground rounded-md shadow-inner"
              />
            </div>
            <div>
              <Label htmlFor="species" className="text-secondary-foreground">
                Species
              </Label>
              <Select value={speciesId} onValueChange={setSpeciesId}>
                <SelectTrigger
                  id="species"
                  className="bg-input text-foreground rounded-md shadow-inner"
                >
                  <SelectValue placeholder="Select a species" />
                </SelectTrigger>
                <SelectContent>
                  {speciesList.map((species) => (
                    <SelectItem
                      key={species.SpeciesID}
                      value={species.SpeciesID.toString()}
                    >
                      {species.SpeciesName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary-dark rounded-md py-3 font-bold transition duration-200"
            >
              Add Breed
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary-foreground mb-4">
          Breeds List
        </h2>
        <table className="min-w-full divide-y divide-muted-foreground bg-card shadow-md rounded-lg">
          <thead className="bg-muted">
            <tr>
              <SortableHeader column="BreedID">ID</SortableHeader>
              <SortableHeader column="BreedName">Breed Name</SortableHeader>
              <SortableHeader column="SpeciesName">Species Name</SortableHeader>
            </tr>
          </thead>
          <tbody className="text-foreground divide-y divide-muted-foreground">
            {filteredBreeds.map((breed) => (
              <tr key={breed.BreedID} className="hover:bg-muted">
                <td className="px-4 py-2">{breed.BreedID}</td>
                <td className="px-4 py-2">{breed.BreedName}</td>
                <td className="px-4 py-2">{breed.SpeciesName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
