"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { getProjects } from "@/lib/data";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

// OpenLayers imports would be here in a real implementation
// For this demo, we'll mock the map functionality
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";

export default function MapPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  // ? When selected project changes, center map
  useEffect(() => {
    if (!selectedProject || !mapInstanceRef.current) return;

    const view = mapInstanceRef.current.getView();
    const coords = fromLonLat([
      selectedProject.location.lng,
      selectedProject.location.lat,
    ]);

    view.animate({
      center: coords,
      duration: 500,
      zoom: 9,
    });
  }, [selectedProject]);

  // ? Fetch all projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data as Project[]);

        // Set first project as selected initially
        if (data.length > 0) {
          setSelectedProject(data[0] as Project);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ? Initialize OpenLayers map
  useEffect(() => {
    if (mapRef.current && projects.length > 0 && !mapInstanceRef.current) {
      const vectorSource = new VectorSource();

      // Add markers
      projects.forEach((project) => {
        const feature = new Feature({
          geometry: new Point(
            fromLonLat([project.location.lng, project.location.lat])
          ),
          name: project.name,
          projectId: project.id,
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // you can replace this with your own pin icon
              scale: 0.05,
              anchor: [0.5, 1],
            }),
          })
        );

        vectorSource.addFeature(feature);
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([
            projects[0].location.lng,
            projects[0].location.lat,
          ]),
          zoom: 6,
        }),
      });

      // Click handler
      map.on("singleclick", function (evt) {
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          const projectId = feature.get("projectId");
          const proj = projects.find((p) => p.id === projectId);
          if (proj) setSelectedProject(proj);
        });
      });

      mapInstanceRef.current = map;
    }
  }, [projects]);

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

  // Create markers data for the map
  const mapMarkers = useMemo(() => {
    return projects.map((project) => ({
      id: project.id,
      position: [project.location.lng, project.location.lat],
      name: project.name,
    }));
  }, [projects]);

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex flex-col">
      <div className="container mx-auto mt-12 flex flex-col lg:flex-row gap-4">
        <div className="lg:col-span-3 h-[calc(100vh-4rem)] w-full flex-[70%] relative">
          {/* Map container */}
          <div
            ref={mapRef}
            className="w-[800px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] relative overflow-hidden rounded-xl border border-[#ddd5ff]">
            {/* Loop through markers */}
            {mapMarkers.map((marker, index) => {
              const project = projects.find((p) => p.id === marker.id);
              const isSelected = project?.id === marker.id;

              // Demo placement – in real use, use lat/lng to pixel conversion
              const left = 10 + ((index * 130) % 600);
              const top = 100 + ((index * 90) % 400);

              return (
                <div
                  key={marker.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out ${
                    isSelected ? "z-10 scale-125" : "z-0 hover:scale-110"
                  }`}
                  style={{ left: `${left}px`, top: `${top}px` }}
                  onClick={() => {
                    const proj = projects.find((p) => p.id === marker.id);
                    if (proj) setSelectedProject(proj);
                  }}>
                  {/* Marker pin */}
                  <div
                    className={`
                flex items-center justify-center
                h-9 w-9 sm:h-8 sm:w-8 rounded-full shadow-lg border border-white
                bg-white/70 backdrop-blur-md
                ${isSelected ? "text-[#8443f1]" : "text-gray-700"}
              `}>
                    <MapPin className="size-5" />
                  </div>

                  {/* Tooltip on selected */}
                  {isSelected && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-[#f5f3ff] text-black font-medium shadow-md whitespace-nowrap z-20">
                      {marker.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="p-4">
            <h2 className="text-[#5b1eb9] tracking-[0.015rem] text-2xl font-bold font-[inter] leading-6 mb-4">
              Project Locations
            </h2>

            {selectedProject && (
              <Card className="mb-6 border-[2px] border-[#c3b4fe] rounded-2xl">
                <CardContent className="p-6 space-y-5">
                  {/* Title + Status */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-[#5e4bff]">
                      {selectedProject.name}
                    </h3>
                    <Badge
                      className={`text-xs px-2 py-1 rounded-md ${getStatusColor(
                        selectedProject.status
                      )}`}>
                      {selectedProject.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{selectedProject.location.address}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>Progress</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <Progress
                      value={selectedProject.progress}
                      className="h-2 bg-[#e9e6ff] [&>div]:bg-[#c3b4fe] rounded-full [&>div]:rounded-full"
                    />
                  </div>

                  {/* View Details Button */}
                  <Link href={`/dashboard/${selectedProject.id}`}>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer gap-2 border-[#c3b4fe] hover:bg-[#f2efff]">
                      View Details
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* ALL LOCATIONS */}
            <div className="space-y-3 bg-white p-5 rounded-xl border border-[#ddd5ff]">
              <h3 className="text-[#5b1eb9] tracking-[0.015rem] text-lg font-bold font-[inter]">
                All Locations
              </h3>

              {projects.map((project) => {
                const isSelected = selectedProject?.id === project.id;

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 rounded-xl cursor-pointer flex items-start gap-3 transition-all duration-200 border ${
                      isSelected
                        ? "bg-[#f3f0ff] border-[#c3b4fe] shadow-sm"
                        : "hover:bg-[#f9f8ff] border-transparent"
                    }`}>
                    <div
                      className={`rounded-full p-2 ${
                        isSelected
                          ? "bg-[#a789fc]/20 text-[#8443f1]"
                          : "bg-[#eee] text-gray-500"
                      }`}>
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">
                        {project.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {project.location.address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
