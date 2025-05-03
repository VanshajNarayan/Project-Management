"use client";

import { Project } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";
import { format } from "date-fns";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
      case "Planning":
        return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
      case "Completed":
        return "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400";
      case "On Hold":
        return "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400";
      case "Approved":
        return "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  // Format dates
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);

  const formattedStartDate = format(startDate, "MMM d, yyyy");
  const formattedEndDate = format(endDate, "MMM d, yyyy");

  return (
    <Card className="overflow-hidden bg-[#ddd5ff]/30 rounded-md border-2 border-[#a789fc] hover:shadow-md transition-shadow group p-1">
      <div className="h-60 overflow-hidden relative">
        {project.images && project.images.length > 0 && (
          <img
            src={project.images[0]}
            alt={project.name}
            className="object-cover w-full h-full transform group-hover:scale-105 rounded-md transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`${getStatusColor(project.status)}`}>
            {project.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-[#5b1eb9] text-xl mb-1 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 text-[#2e0f66]">
            {project.description}
          </p>
        </div>

        <div className="flex items-center text-xs text-muted-foreground gap-2 mb-3">
          <MapPin className="h-3 w-3 flex-shrink-0 text-[#a789fc]" />
          <span className="truncate text-[#2e0f66]">
            {project.location.address}
          </span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="bg-[#ddd5ff] text-black rounded-md px-2 py-1">
                Progress
              </span>
              <span className="font-medium text-[#2e0f66]">
                {project.progress}%
              </span>
            </div>
            <Progress
              value={project.progress}
              className="h-2 bg-[#e9e6ff] [&>div]:bg-[#c3b4fe] rounded-full [&>div]:rounded-full mb-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground text-[#2e0f66]">
                Start Date
              </span>
              <p className="font-medium text-[#2e0f66]">{formattedStartDate}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-[#2e0f66]">
                End Date
              </span>
              <p className="font-medium text-[#2e0f66]">{formattedEndDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end text-[#5b1eb9]">
        <Link href={`/dashboard/${project.id}`}>
          <Button variant="link" size="sm" className="gap-1 cursor-pointer">
            <span>View Details</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
