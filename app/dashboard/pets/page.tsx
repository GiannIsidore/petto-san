"use client";

import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PawPrintIcon, ArrowUpDown, Dog } from "lucide-react";
import axios from "axios";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  owner: string;
  date: Date;
}

interface Species {
  SpeciesID: number;
  SpeciesName: string;
}

interface Breed {
  BreedID: number;
  BreedName: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [breedList, setBreedList] = useState<Breed[]>([]);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Pet | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Fetch pets data
    axios
      .get("http://localhost/petto-san/php/get_pets.php")
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);
          setPets(response.data.data);
          setFilteredPets(response.data.data);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching pets data:", error);
      });

    // Fetch species data
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
        console.error("Error fetching species data:", error);
      });
  }, []);

  useEffect(() => {
    if (speciesId) {
      axios
        .get(
          `http://localhost/petto-san/php/get_breeds_by_species.php?speciesId=${speciesId}`
        )
        .then((response) => {
          if (response.data.success) {
            setBreedList(response.data.data);
          } else {
            console.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching breeds:", error);
        });
    }
  }, [speciesId]);

  const handleSpeciesChange = (speciesName: string) => {
    setSpeciesFilter(speciesName);
    setBreedFilter(""); // Reset breed filter when species changes

    if (speciesName && speciesName !== "*") {
      const selectedSpecies = speciesList.find(
        (species) => species.SpeciesName === speciesName
      );
      setSpeciesId(selectedSpecies?.SpeciesID || null);
    } else {
      setSpeciesId(null);
      setBreedList([]); // Clear breed list if "All Species" is selected
    }
  };

  const handleFilter = () => {
    let filtered = [...pets];

    if (ownerFilter) {
      filtered = filtered.filter((pet) =>
        pet.owner.toLowerCase().includes(ownerFilter.toLowerCase())
      );
    }
    if (breedFilter) {
      filtered = filtered.filter((pet) =>
        pet.breed.toLowerCase().includes(breedFilter.toLowerCase())
      );
    }
    if (speciesFilter && speciesFilter !== "*") {
      filtered = filtered.filter(
        (pet) => pet.species.toLowerCase() === speciesFilter.toLowerCase()
      );
    }

    setFilteredPets(filtered);
  };

  const handleSort = (column: keyof Pet) => {
    const newSortDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedPets = [...filteredPets].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPets(sortedPets);
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof Pet;
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center text-primary-foreground">
        <PawPrintIcon className="mr-2 h-6 w-6 text-accent" />
        Pet List
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="ownerFilter"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Filter by Owner
          </label>
          <Input
            id="ownerFilter"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            placeholder="Owner name"
            className="bg-input text-foreground border-muted focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="breedFilter"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Filter by Breed
          </label>
          <Select
            value={breedFilter}
            onValueChange={setBreedFilter}
            disabled={!breedList.length}
          >
            <SelectTrigger
              id="breedFilter"
              className="bg-input text-foreground border-muted focus:border-primary"
            >
              <SelectValue placeholder="Select breed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Breeds</SelectItem>
              {breedList.map((breed) => (
                <SelectItem key={breed.BreedID} value={breed.BreedName}>
                  {breed.BreedName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="speciesFilter"
            className="block text-sm font-medium text-muted-foreground mb-1"
          >
            Filter by Species
          </label>
          <Select value={speciesFilter} onValueChange={handleSpeciesChange}>
            <SelectTrigger
              id="speciesFilter"
              className="bg-input text-foreground border-muted focus:border-primary"
            >
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All Species</SelectItem>
              {speciesList.map((species) => (
                <SelectItem key={species.SpeciesID} value={species.SpeciesName}>
                  {species.SpeciesName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleFilter}
        className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"
      >
        Apply Filters
      </Button>

      <Table className="bg-card shadow-md rounded-lg">
        <TableHeader className="bg-muted">
          <TableRow>
            <SortableHeader column="id">ID</SortableHeader>
            <SortableHeader column="name">Pet Name</SortableHeader>
            <SortableHeader column="species">Species</SortableHeader>
            <SortableHeader column="breed">Breed</SortableHeader>
            <SortableHeader column="owner">Owner</SortableHeader>
            <SortableHeader column="date">Birth Date</SortableHeader>
          </TableRow>
        </TableHeader>
        <TableBody className="text-foreground">
          {filteredPets.map((pet) => (
            <TableRow key={pet.id} className="hover:bg-muted">
              <TableCell className="px-4 py-2">{pet.id}</TableCell>
              <TableCell className="px-4 py-2">{pet.name}</TableCell>
              <TableCell className="px-4 py-2">{pet.species}</TableCell>
              <TableCell className="px-4 py-2">{pet.breed}</TableCell>
              <TableCell className="px-4 py-2">{pet.owner}</TableCell>
              <TableCell className="px-4 py-2">{pet.date.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredPets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No pets found matching the current filters.
          </p>
          <Dog className="h-16 w-16 mx-auto mt-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
