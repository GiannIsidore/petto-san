import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dog, Users, Database, Clipboard, DogIcon } from "lucide-react";
import Link from "next/link";
export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-8 p-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Welcome to PetPals System
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Streamline your pet management with our comprehensive solution
          </p>
          <Link
            href="/dashboard"
            className="bg-primary rounded-md p-3 text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Link>
        </section>

        <section id="features">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Dog className="text-primary" size={40} />}
              title="Species & Breeds"
              description="Manage diverse species and breeds with ease."
            />
            <FeatureCard
              icon={<Users className="text-primary" size={40} />}
              title="Owner Management"
              description="Keep track of pet owners and their contact information."
            />
            <FeatureCard
              icon={<Database className="text-primary" size={40} />}
              title="Pet Profiles"
              description="Create detailed profiles for each pet in your care."
            />
            <FeatureCard
              icon={<Clipboard className="text-primary" size={40} />}
              title="Health Records"
              description="Maintain comprehensive health records and schedules."
            />
          </div>
        </section>

        <section id="about" className="bg-secondary/10 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-primary">
                About PetPals System
              </h2>
              <p className="text-muted-foreground mb-4">
                PetPals System is designed to revolutionize pet management
              </p>
              <p className="text-muted-foreground">
                This system will handle your{" "}
                <span className="font-bold">Dinosaur, Dragon,</span> Dogs, Cats,
                Bears, and etc.
              </p>
            </div>
            <div className="  flex items-center justify-center md:w-1/2">
              <DogIcon className="w-[300px] h-auto" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
