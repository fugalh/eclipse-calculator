import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/reference";
import { FlaskConical, Wrench, Users, Swords, GitCompare } from "lucide-react";

const REFERENCE_SECTIONS = [
  {
    title: "Technologies",
    href: "/reference/techs",
    description: "Tech tree with costs, categories, and effects",
    icon: FlaskConical,
    count: "39 techs",
    color: "text-blue-500",
  },
  {
    title: "Ship Parts",
    href: "/reference/ship-parts",
    description: "Weapons, shields, drives, and energy sources",
    icon: Wrench,
    count: "30+ parts",
    color: "text-orange-500",
  },
  {
    title: "Species",
    href: "/reference/species",
    description: "Starting conditions and special abilities",
    icon: Users,
    count: "7 species",
    color: "text-green-500",
  },
  {
    title: "Combat",
    href: "/reference/combat",
    description: "Battle rules and quick reference",
    icon: Swords,
    count: "10 sections",
    color: "text-red-500",
  },
  {
    title: "Edition Differences",
    href: "/reference/differences",
    description: "Second Dawn vs New Dawn changes",
    icon: GitCompare,
    count: "25+ changes",
    color: "text-purple-500",
  },
];

export default function ReferencePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Quick Reference"
        description="Reference guides for Eclipse: Second Dawn for the Galaxy"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REFERENCE_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className={`h-8 w-8 ${section.color}`} />
                    <Badge variant="secondary">{section.count}</Badge>
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
          <CardDescription>
            Helpful shortcuts and features for using this reference
          </CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              Toggle between <strong>symbolic</strong> and{" "}
              <strong>descriptive</strong> notation using the button in the
              header
            </li>
            <li>
              Use the <strong>filter buttons</strong> to narrow down by category
              or type
            </li>
            <li>
              On the <strong>Species</strong> page, select multiple species to
              compare them side-by-side
            </li>
            <li>
              <strong>Combat</strong> sections expand to show examples and tips
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
