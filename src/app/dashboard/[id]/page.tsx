"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import ImagesTab from "@/components/projects/tabs/images-tab";
import VideosTab from "@/components/projects/tabs/videos-tab";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const data = await getProjectById(id as string);
          if (data) {
            setProject(data as Project);
          } else {
            console.warn("Project not found!");
            setProject(null); // explicitly setting to null
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-6">
          The project you&apos;re looking for doesn&apos;t exist or was removed.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const formattedStartDate = format(
    new Date(project.startDate),
    "MMMM d, yyyy"
  );
  const formattedEndDate = format(new Date(project.endDate), "MMMM d, yyyy");

  const position: LatLngExpression = [
    project.location.lat,
    project.location.lng,
  ];

  return (
    <div className="bg-[#f5f3ff] py-6 space-y-6">
      <div className="container mx-auto flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-1 cursor-pointer text-[#2e0f66]"
          onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Button>
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PROJECT NAME AND DESCRIPTION */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl text-[#5b1eb9] font-bold tracking-tight mb-2">
              {project.name}
            </h1>
            <p className="text-[#2e0f66]">{project.description}</p>
          </div>

          {/* INFORMATION  */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border-1 border-[#c3b4fe] p-4">
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm text-[#5b1eb9] flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#5b1eb9]" />
                  Start Date
                </span>
                <span className="font-medium text-[#2e0f66]">
                  {formattedStartDate}
                </span>
              </div>
            </div>

            <div className="bg-card rounded-lg border-1 border-[#c3b4fe] p-4">
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm text-[#5b1eb9] flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-[#5b1eb9]" />
                  End Date
                </span>
                <span className="font-medium text-[#2e0f66]">
                  {formattedEndDate}
                </span>
              </div>
            </div>

            <div className="bg-card rounded-lg border-1 border-[#c3b4fe] p-4">
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm text-[#5b1eb9] flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-[#5b1eb9]" />
                  Budget
                </span>
                <span className="font-medium text-[#2e0f66]">
                  ${project.budget.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-card rounded-lg border-1 border-[#c3b4fe] p-4">
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm text-[#5b1eb9] flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#5b1eb9]" />
                  Team Size
                </span>
                <span className="font-medium text-[#2e0f66]">
                  {project.team.length} members
                </span>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-sm text-[#2e0f66] bg-[#ddd5ff] rounded-md px-3 py-1">
                Progress
              </h3>
              <span className="text-sm font-medium text-[#2e0f66]">
                {project.progress}%
              </span>
            </div>
            <Progress
              value={project.progress}
              className="h-2 bg-[#e9e6ff] [&>div]:bg-[#c3b4fe] rounded-full [&>div]:rounded-full"
            />
          </div>

          {/* TAGS */}
          <div>
            <h3 className="font-medium mb-3 text-[#2e0f66]">Project Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#ddd5ff] text-black px-3 py-1 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* TEAM MEMBERS */}
          <div>
            <h3 className="font-medium mb-3">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {project.team.map((member, index) => (
                <div
                  key={index}
                  className="inline-flex items-center text-sm px-3 py-1 rounded-md bg-[#ddd5ff] text-black">
                  <span>{member}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGES & VIDEOS */}
          <Tabs defaultValue="images" className="pt-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2 gap-2">
              <TabsTrigger
                value="images"
                className="border-2 border-[#c3b4fe] p-2 rounded-md cursor-pointer text-[#2e0f66]">
                Images
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="border-2 border-[#c3b4fe] p-2 rounded-md cursor-pointer text-[#2e0f66]">
                Videos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="images" className="pt-4">
              <ImagesTab images={project.images} />
            </TabsContent>
            <TabsContent value="videos" className="pt-4">
              <VideosTab videos={project.videos} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* PROJECT LOCATION */}
          <div className="bg-card bg-[#ddd5ff]/30 rounded-lg p-6 border-2 border-[#c3b4fe]">
            <h3 className="text-[#5b1eb9] tracking-[0.015rem] text-2xl font-bold font-[inter] leading-6 mb-4">
              Project Location
            </h3>

            {/* Map Preview */}
            <div className="aspect-video rounded-md overflow-hidden mb-3">
              {/* <div id="map-preview" className="h-full w-full relative">
                <MapContainer
                  center={position}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                  attributionControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={redIcon}>
                    <Popup>{project.location.address}</Popup>
                  </Marker>
                </MapContainer>
              </div> */}
              <MapView center={position} title={project.location.address} />
            </div>

            {/* Address Display */}
            <p className="text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#5b1eb9]" />
              <span className="text-[#2e0f66]">{project.location.address}</span>
            </p>

            {/* View on Map Button */}
            <Button
              className="w-full mt-4 cursor-pointer border-[#c3b4fe] text-[#2e0f66]"
              variant="outline"
              onClick={() => router.push("/map")}>
              View on Map
            </Button>
          </div>

          {/* CONTACT MANAGER */}
          <div className="bg-card rounded-lg bg-[#ddd5ff]/30 border-2 border-[#c3b4fe] p-6">
            <h3 className="text-[#5b1eb9] tracking-[0.015rem] text-2xl font-bold font-[inter] leading-6 mb-4">
              Project Manager
            </h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-[#2e0f66]">
                  {project.manager
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-medium text-[#2e0f66]">{project.manager}</p>
                <p className="text-sm text-[#2e0f66]">Project Manager</p>
              </div>
            </div>
            <Button
              className="w-full text-[#2e0f66] border-2 border-[#c3b4fe]"
              variant="outline">
              Contact Manager
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
