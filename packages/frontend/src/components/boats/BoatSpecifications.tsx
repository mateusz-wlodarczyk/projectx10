"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Users, Calendar, Anchor, Star } from "lucide-react";

interface SingleBoatParameters {
  max_sleeps: number;
  max_people: number;
  allowed_people: number;
  single_cabins: number;
  double_cabins: number;
  triple_cabins: number;
  quadruple_cabins: number;
  cabins: number;
  cabins_with_bunk_bed: number;
  saloon_sleeps: number;
  crew_sleeps: number;
  toilets: number;
  electric_toilets: number;
  length: number;
  beam: number;
  draft: number;
  year: number;
  renovated_year: number;
  sail_renovated_year: number;
  engine_power: number;
  number_engines: number;
  total_engine_power: number;
  engine: string;
  fuel: number;
  cruising_consumption: number;
  maximum_speed: number;
  water_tank: number;
  waste_tank: number;
  single_cabins_outdoor_entrance: boolean;
  single_cabins_indoor_entrance: boolean;
}

interface BoatSpecificationsProps {
  specifications: SingleBoatParameters;
  onSpecificationClick: (spec: string) => void;
  onParameterHighlight: (parameter: string) => void;
  loading: boolean;
}

const BoatSpecifications: React.FC<BoatSpecificationsProps> = ({
  specifications,
  onSpecificationClick,
  onParameterHighlight,
  loading,
}) => {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "basic",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const specificationSections = [
    {
      id: "basic",
      title: "Basic Information",
      icon: Settings,
      specs: [
        { label: "Length", value: `${specifications.length}m`, key: "length" },
        { label: "Beam", value: `${specifications.beam}m`, key: "beam" },
        { label: "Draft", value: `${specifications.draft}m`, key: "draft" },
        { label: "Year", value: specifications.year.toString(), key: "year" },
        {
          label: "Renovated Year",
          value: specifications.renovated_year?.toString() || "N/A",
          key: "renovated_year",
        },
      ],
    },
    {
      id: "accommodation",
      title: "Accommodation",
      icon: Users,
      specs: [
        {
          label: "Max Sleeps",
          value: specifications.max_sleeps.toString(),
          key: "max_sleeps",
        },
        {
          label: "Max People",
          value: specifications.max_people.toString(),
          key: "max_people",
        },
        {
          label: "Allowed People",
          value: specifications.allowed_people.toString(),
          key: "allowed_people",
        },
        {
          label: "Total Cabins",
          value: specifications.cabins.toString(),
          key: "cabins",
        },
        {
          label: "Single Cabins",
          value: specifications.single_cabins.toString(),
          key: "single_cabins",
        },
        {
          label: "Double Cabins",
          value: specifications.double_cabins.toString(),
          key: "double_cabins",
        },
        {
          label: "Triple Cabins",
          value: specifications.triple_cabins.toString(),
          key: "triple_cabins",
        },
        {
          label: "Quadruple Cabins",
          value: specifications.quadruple_cabins.toString(),
          key: "quadruple_cabins",
        },
        {
          label: "Saloon Sleeps",
          value: specifications.saloon_sleeps.toString(),
          key: "saloon_sleeps",
        },
        {
          label: "Crew Sleeps",
          value: specifications.crew_sleeps.toString(),
          key: "crew_sleeps",
        },
      ],
    },
    {
      id: "facilities",
      title: "Facilities",
      icon: Settings,
      specs: [
        {
          label: "Toilets",
          value: specifications.toilets.toString(),
          key: "toilets",
        },
        {
          label: "Electric Toilets",
          value: specifications.electric_toilets.toString(),
          key: "electric_toilets",
        },
        {
          label: "Water Tank",
          value: `${specifications.water_tank}L`,
          key: "water_tank",
        },
        {
          label: "Waste Tank",
          value: `${specifications.waste_tank}L`,
          key: "waste_tank",
        },
        {
          label: "Single Cabins Outdoor Entrance",
          value: specifications.single_cabins_outdoor_entrance ? "Yes" : "No",
          key: "single_cabins_outdoor_entrance",
        },
        {
          label: "Single Cabins Indoor Entrance",
          value: specifications.single_cabins_indoor_entrance ? "Yes" : "No",
          key: "single_cabins_indoor_entrance",
        },
      ],
    },
    {
      id: "engine",
      title: "Engine & Performance",
      icon: Settings,
      specs: [
        { label: "Engine", value: specifications.engine, key: "engine" },
        {
          label: "Engine Power",
          value: `${specifications.engine_power}HP`,
          key: "engine_power",
        },
        {
          label: "Number of Engines",
          value: specifications.number_engines.toString(),
          key: "number_engines",
        },
        {
          label: "Total Engine Power",
          value: `${specifications.total_engine_power}HP`,
          key: "total_engine_power",
        },
        {
          label: "Fuel Capacity",
          value: `${specifications.fuel}L`,
          key: "fuel",
        },
        {
          label: "Cruising Consumption",
          value: `${specifications.cruising_consumption}L/h`,
          key: "cruising_consumption",
        },
        {
          label: "Maximum Speed",
          value: `${specifications.maximum_speed}kts`,
          key: "maximum_speed",
        },
      ],
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Specifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {specificationSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="border rounded-lg">
              <button
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{section.title}</h3>
                </div>
                <span
                  className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {section.specs.map((spec) => (
                      <div
                        key={spec.key}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => {
                          onSpecificationClick(spec.key);
                          onParameterHighlight(spec.key);
                        }}
                      >
                        <span className="text-sm font-medium">
                          {spec.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Separator />

        {/* Additional Information */}
        <div className="space-y-3">
          <h3 className="font-medium">Additional Information</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• All specifications are subject to change without notice</p>
            <p>• Actual performance may vary based on conditions</p>
            <p>• Some features may require additional charges</p>
            <p>• Contact charter company for specific requirements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatSpecifications;
