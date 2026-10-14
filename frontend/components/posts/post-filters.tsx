"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlatforms } from "@/lib/api/platforms";
import type { Platform, PostType } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PostFiltersProps = {
  type?: PostType;
  platformId?: number;
  platforms?: Platform[];
  onChange: (next: {
    type?: PostType;
    platformId?: number;
  }) => void;
};

export function PostFilters({
  type,
  platformId,
  platforms,
  onChange,
}: PostFiltersProps) {
  const platformsQuery = useQuery({
    queryKey: ["platforms"],
    queryFn: getPlatforms,
    enabled: !platforms,
  });

  const platformOptions = platforms ?? platformsQuery.data ?? [];

  return (
    <div
      className={cn(
        "surface grid gap-3 rounded-lg p-4",
        "sm:grid-cols-2",
      )}
    >
      <div>
        <Label htmlFor="filter-type">Type</Label>
        <Select
          id="filter-type"
          value={type ?? ""}
          onChange={(event) =>
            onChange({
              platformId,
              type: (event.target.value || undefined) as PostType | undefined,
            })
          }
        >
          <option value="">All types</option>
          <option value="BUG">Bug</option>
          <option value="FIX">Fix</option>
          <option value="IDEA">Idea</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="filter-platform">Platform</Label>
        <Select
          id="filter-platform"
          value={platformId?.toString() ?? ""}
          onChange={(event) =>
            onChange({
              type,
              platformId: event.target.value
                ? Number(event.target.value)
                : undefined,
            })
          }
        >
          <option value="">All platforms</option>
          {platformOptions.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
