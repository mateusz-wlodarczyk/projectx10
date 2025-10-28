"use client";

import React from "react";
import { SingleBoatParameters } from "@/src/types/boat-detail";

interface BoatParametersProps {
  parameters: SingleBoatParameters;
  loading: boolean;
}

export default function BoatParameters({
  parameters,
  loading,
}: BoatParametersProps) {
  if (loading || !parameters) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Group parameters by category
  const groupedParams = {
    capacity: {
      max_sleeps: parameters.max_sleeps,
      max_people: parameters.max_people,
      allowed_people: parameters.allowed_people,
      saloon_sleeps: parameters.saloon_sleeps,
      crew_sleeps: parameters.crew_sleeps,
    },
    cabins: {
      cabins: parameters.cabins,
      single_cabins: parameters.single_cabins,
      double_cabins: parameters.double_cabins,
      triple_cabins: parameters.triple_cabins,
      quadruple_cabins: parameters.quadruple_cabins,
      cabins_with_bunk_bed: parameters.cabins_with_bunk_bed,
    },
    facilities: {
      toilets: parameters.toilets,
      electric_toilets: parameters.electric_toilets,
    },
    dimensions: {
      length: parameters.length,
      beam: parameters.beam,
      draft: parameters.draft,
    },
    year: {
      year: parameters.year,
      renovated_year: parameters.renovated_year,
      sail_renovated_year: parameters.sail_renovated_year,
    },
    engine: {
      engine_power: parameters.engine_power,
      number_engines: parameters.number_engines,
      total_engine_power: parameters.total_engine_power,
      engine: parameters.engine,
      fuel: parameters.fuel,
      cruising_consumption: parameters.cruising_consumption,
      maximum_speed: parameters.maximum_speed,
    },
    tanks: {
      water_tank: parameters.water_tank,
      waste_tank: parameters.waste_tank,
    },
    cabinAccess: {
      single_cabins_outdoor_entrance: parameters.single_cabins_outdoor_entrance,
      single_cabins_indoor_entrance: parameters.single_cabins_indoor_entrance,
    },
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "";

    switch (key) {
      case "length":
      case "beam":
      case "draft":
        return `${value}m`;
      case "fuel":
      case "water_tank":
      case "waste_tank":
        return `${value}L`;
      case "cruising_consumption":
        return `${value}L/h`;
      case "maximum_speed":
        return `${value} węzłów`;
      case "engine_power":
      case "total_engine_power":
        return `${value}kW`;
      case "single_cabins_outdoor_entrance":
      case "single_cabins_indoor_entrance":
        return value ? "Tak" : "Nie";
      default:
        return value.toString();
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      capacity: "Pojemność",
      cabins: "Kabiny",
      facilities: "Udogodnienia",
      dimensions: "Wymiary",
      year: "Rok",
      engine: "Silnik",
      tanks: "Zbiorniki",
      cabinAccess: "Dostęp do kabin",
    };
    return labels[category] || category;
  };

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      max_sleeps: "Maksymalna liczba miejsc do spania",
      max_people: "Maksymalna liczba osób",
      allowed_people: "Dozwolona liczba osób",
      saloon_sleeps: "Miejsca do spania w salonie",
      crew_sleeps: "Miejsca do spania dla załogi",
      cabins: "Liczba kabin",
      single_cabins: "Kabin pojedynczych",
      double_cabins: "Kabin podwójnych",
      triple_cabins: "Kabin potrójnych",
      quadruple_cabins: "Kabin poczwórnych",
      cabins_with_bunk_bed: "Kabin z łóżkami piętrowymi",
      toilets: "Liczba toalet",
      electric_toilets: "Liczba toalet elektrycznych",
      length: "Długość",
      beam: "Szerokość",
      draft: "Zanurzenie",
      year: "Rok budowy",
      renovated_year: "Rok renowacji",
      sail_renovated_year: "Rok renowacji żagli",
      engine_power: "Moc silnika",
      number_engines: "Liczba silników",
      total_engine_power: "Całkowita moc silników",
      engine: "Typ silnika",
      fuel: "Pojemność zbiornika paliwa",
      cruising_consumption: "Zużycie paliwa przy żegludze",
      maximum_speed: "Maksymalna prędkość",
      water_tank: "Pojemność zbiornika wody",
      waste_tank: "Pojemność zbiornika ścieków",
      single_cabins_outdoor_entrance:
        "Wejście zewnętrzne do kabin pojedynczych",
      single_cabins_indoor_entrance: "Wejście wewnętrzne do kabin pojedynczych",
    };
    return labels[key] || key;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        Parametry techniczne
      </h3>

      {Object.entries(groupedParams).map(([category, params]) => {
        const hasData = Object.values(params).some(
          (value) => value !== null && value !== undefined && value !== 0
        );

        if (!hasData) return null;

        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">
              {getCategoryLabel(category)}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(params).map(([key, value]) => {
                if (value === null || value === undefined || value === 0)
                  return null;

                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {getFieldLabel(key)}:
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatValue(key, value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
