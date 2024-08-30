"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrintIcon, ArrowUpDown } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Owner {
  OwnerID: number;
  Name: string;
  Address: string;
  ContactDetails: string;
}

export default function AddOwnerPage() {
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Owner | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { toast } = useToast();

  useEffect(() => {
    axios
      .get("http://localhost/petto-san/php/get_owners.php")
      .then((response) => {
        if (response.data.success) {
          setOwners(response.data.data);
          setFilteredOwners(response.data.data);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the owners!", error);
      });
  }, []);

  const handleSort = (column: keyof Owner) => {
    const newSortDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);

    const sortedOwners = [...filteredOwners].sort((a, b) => {
      if (a[column] < b[column]) return newSortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredOwners(sortedOwners);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/petto-san/php/add-owner.php",
        {
          ownerName: ownerName,
          address: address,
          phone: phone,
        }
      );

      if (response.data.success) {
        toast({
          title: `${ownerName}, was Added as Owner 🤙`,
          variant: "success",
        });
        setMessage("Owner added successfully!");
        setOwnerName("");
        setAddress("");
        setPhone("");
        axios
          .get("http://localhost/petto-san/php/get_owners.php")
          .then((response) => {
            if (response.data.success) {
              setOwners(response.data.data);
              setFilteredOwners(response.data.data);
            } else {
              console.error(response.data.message);
            }
          });
      } else {
        toast({
          title: `${ownerName}, was not added as Owner (´。＿。｀)`,
          variant: "warning",
        });
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("An error occurred while adding the owner.");
      console.error("There was an error!", error);
    }
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof Owner;
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
      {/* Floating Stickers */}
      <div className="absolute top-10 right-4 opacity-50 animate-float-fast">
        <PawPrintIcon className="text-secondary h-40 w-40" />
      </div>
      <div className="absolute bottom-28 left-4 opacity-50 animate-float-slow">
        <PawPrintIcon className="text-accent h-40 w-40" />
      </div>
      <Card className="max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary-foreground mb-4">
            Add New Owner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ownerName" className="text-muted-foreground">
                Owner Name
              </Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="bg-input text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-muted-foreground">
                Address
              </Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="bg-input text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-muted-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-input text-foreground"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Add Owner
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary-foreground mb-4">
          Owners List
        </h2>
        <table className="min-w-full divide-y divide-muted-foreground bg-card shadow-md rounded-lg">
          <thead className="bg-muted">
            <tr>
              <SortableHeader column="OwnerID">ID</SortableHeader>
              <SortableHeader column="Name">Owner Name</SortableHeader>
              <SortableHeader column="Address">Address</SortableHeader>
              <SortableHeader column="ContactDetails">Phone</SortableHeader>
            </tr>
          </thead>
          <tbody className="text-foreground divide-y divide-muted-foreground">
            {filteredOwners.map((owner) => (
              <tr key={owner.OwnerID} className="hover:bg-muted">
                <td className="px-4 py-2">{owner.OwnerID}</td>
                <td className="px-4 py-2">{owner.Name}</td>
                <td className="px-4 py-2">{owner.Address}</td>
                <td className="px-4 py-2">{owner.ContactDetails}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
