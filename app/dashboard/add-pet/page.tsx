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
import { PawPrintIcon } from "lucide-react"; // Ensure this icon is available
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
interface Species {
  SpeciesID: number;
  SpeciesName: string;
}

interface Breed {
  BreedID: number;
  BreedName: string;
}

interface Owner {
  OwnerID: number;
  Name: string;
}

export default function AddPetPage() {
  const [petName, setPetName] = useState<string>("");
  const [speciesId, setSpeciesId] = useState<string>("");
  const [breedId, setBreedId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { toast } = useToast();
  useEffect(() => {
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
        console.error("Error fetching species:", error);
      });

    axios
      .get("http://localhost/petto-san/php/get_owners.php")
      .then((response) => {
        if (response.data.success) {
          setOwners(response.data.data);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching owners:", error);
      });
  }, []);

  useEffect(() => {
    if (speciesId) {
      // Fetch breeds based on selected species
      axios
        .get(
          `http://localhost/petto-san/php/get_breeds_by_species.php?speciesId=${speciesId}`
        )
        .then((response) => {
          if (response.data.success) {
            setBreeds(response.data.data);
          } else {
            console.error(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching breeds:", error);
        });
    }
  }, [speciesId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/petto-san/php/add_pet.php",
        {
          petName: petName,
          speciesId: speciesId,
          breedId: breedId,
          ownerId: ownerId,
          date: date,
        }
      );

      if (response.data.success) {
        setMessage("Pet added successfully!");
        toast({
          title: "Petttoo added successfully （￣︶￣）↗🐶 ",
          variant: "success",
        });
      } else {
        toast({
          title: "＞﹏＜",
          description: `${response.data.message}`,
          variant: "warning",
        });
        setMessage(response.data.message);
      }

      setPetName("");
      setSpeciesId("");
      setBreedId("");
      setOwnerId("");
    } catch (error) {
      setMessage("An error occurred while adding the pet.");
      toast({
        title: "＞﹏＜",
        description: `An error occurred while adding the pet.`,
        variant: "destructive",
      });

      console.error("There was an error!", error);
    }
  };

  return (
    <div className="relative bg-background min-h-screen p-8">
      {/* Floating Stickers */}
      <div className="absolute top-4 right-4  opacity-50 animate-float-fast">
        <PawPrintIcon className="text-secondary h-40 w-40" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-50 animate-float-slow">
        <PawPrintIcon className="text-accent h-40 w-40" />
      </div>

      <Card className="max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className=" flex  gap-5 text-2xl font-bold text-primary-foreground mb-4">
            Add New Pet
            <div className="  opacity-50 animate-float-fast">
              <PawPrintIcon className="text-secondary h-14 w-14" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="petName" className="text-muted-foreground">
                Pet Name
              </Label>
              <Input
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
                className="bg-input text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="species" className="text-muted-foreground">
                Species
              </Label>
              <Select value={speciesId} onValueChange={setSpeciesId}>
                <SelectTrigger
                  id="species"
                  className="bg-input text-foreground"
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
            <div>
              <Label htmlFor="breed" className="text-muted-foreground">
                Breed
              </Label>
              {speciesId ? (
                <Select value={breedId} onValueChange={setBreedId}>
                  <SelectTrigger
                    id="breed"
                    className="bg-input text-foreground"
                  >
                    <SelectValue placeholder="Select a breed" />
                  </SelectTrigger>
                  <SelectContent>
                    {breeds.map((breed) => (
                      <SelectItem
                        key={breed.BreedID}
                        value={breed.BreedID.toString()}
                      >
                        {breed.BreedName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-500">Please select a species first.</p>
              )}
            </div>
            <div>
              <Label htmlFor="breed" className="text-muted-foreground">
                Date of Birth
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />{" "}
            </div>

            <div>
              <Label htmlFor="owner" className="text-muted-foreground">
                Owner
              </Label>
              <Select value={ownerId} onValueChange={setOwnerId}>
                <SelectTrigger id="owner" className="bg-input text-foreground">
                  <SelectValue placeholder="Select an owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem
                      key={owner.OwnerID}
                      value={owner.OwnerID.toString()}
                    >
                      {owner.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Add Pet
            </Button>
          </form>
          {/* {message && <p className="mt-4 text-primary">{message}</p>} */}
        </CardContent>
      </Card>
    </div>
  );
}
