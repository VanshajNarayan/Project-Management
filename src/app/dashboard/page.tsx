"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getProjects, searchProjects } from "@/lib/data"; // adjust path
import { Project } from "@/lib/types";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/projects/project-card";

export default function ProjectScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ? Fetch projects when search term changes
  useEffect(() => {
    const fetchProjects = async () => {
      const results = await searchProjects(search);
      setProjects(results as Project[]);
    };
    fetchProjects();
  }, [search]);

  // ? Fetch projects on initial render
  useEffect(() => {
    const fetchProjects = async () => {
      const results = await getProjects();
      setProjects(results as Project[]);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6 bg-[#f5f3ff] min-h-screen">
      <h1 className="text-4xl font-[Sans] tracking-[0.08em] font-extrabold text-center text-[#2e0f66] mb-6">
        Projects
      </h1>
      {/* SEARCH BAR */}
      <div className="flex justify-center mb-6">
        <Input
          type="text"
          placeholder="Search projects..."
          className="w-full max-w-lg bg-white border-[#ddd5ff] rounded-xl focus:ring-2 focus:ring-[#c3b4fe] focus:border-[#8443f1] transition-all px-4 py-2 text-sm text-[#2e0f66] font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* PROJECT CARDS */}
      {search ? (
        <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card
              key={project.id}
              className="bg-[#ddd5ff]/30 border-2 border-[#ddd5ff] rounded-2xl transition hover:scale-[1.02]"
              onClick={() => router.push(`/dashboard/${project.id}`)}>
              <CardContent className="p-4 space-y-3 cursor-pointer">
                <h2 className="text-xl text-[#5b1eb9] font-bold">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-sm">📍 {project.location.address}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} className="bg-[#ddd5ff] text-black">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div>
                  <p className="text-sm mb-2">Progress: {project.progress}%</p>
                  <Progress
                    value={project.progress}
                    className="h-2 bg-[#e9e6ff] [&>div]:bg-[#c3b4fe] rounded-full [&>div]:rounded-full"
                  />
                </div>

                <div className="text-sm text-gray-700">
                  Manager:{" "}
                  <span className="font-medium">{project.manager}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Team: {project.team.join(", ")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
