"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/data";
import { Project } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ChartsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data as Project[]);
        if (data.length > 0) {
          setSelectedProject(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Prepare data for the status distribution chart
  const statusData = projects.reduce(
    (acc: { name: string; value: number }[], project) => {
      const existingStatus = acc.find((item) => item.name === project.status);
      if (existingStatus) {
        existingStatus.value += 1;
      } else {
        acc.push({ name: project.status, value: 1 });
      }
      return acc;
    },
    []
  );

  // Progress data for all projects
  const progressData = projects.map((project) => ({
    name: project.name,
    progress: project.progress,
  }));

  // Get project progress over time data
  const getProjectProgressData = () => {
    if (selectedProject === "all") {
      // Combine monthly progress from all projects
      const allMonths = new Set<string>();
      projects.forEach((project) => {
        project.monthlyProgress.forEach((item) => {
          allMonths.add(item.month);
        });
      });

      const monthsArray = Array.from(allMonths);
      return monthsArray.map((month) => {
        const dataPoint: { month: string; [key: string]: string | number } = {
          month,
        };
        projects.forEach((project) => {
          const monthData = project.monthlyProgress.find(
            (item) => item.month === month
          );
          dataPoint[project.name] = monthData ? monthData.progress : 0;
        });
        return dataPoint;
      });
    } else {
      // Get monthly progress for selected project
      const project = projects.find((p) => p.id === selectedProject);
      return project ? project.monthlyProgress : [];
    }
  };

  // Colors for pie chart
  const COLORS = ["#8443f1", "#a789fc", "#c3b4fe", "#5e4bff", "#d9cfff"];

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex flex-col">
      <div className="container mx-auto py-6 space-y-6">
        {/* HEADING */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold font-[Sans] tracking-[0.02em] text-[#2e0f66] leading-5">
            Analytics Dashboard
          </h1>
          <p className="text-lg font-medium font-[Sans] tracking-[0.02em] text-[#2e0f66]">
            View data visualizations for your projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PROJECT STATUS */}
          <Card className="border-2 border-[#c3b4fe]">
            <CardHeader>
              <CardTitle className="text-[#5b1eb9] tracking-[0.015rem] text-2xl font-bold font-[inter] leading-6">
                Project Status
              </CardTitle>
              <CardDescription className="text-[#2e0f66] font-[inter] tracking-[0.025rem]">
                Distribution of project statuses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }>
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9f9ff",
                      borderColor: "#ddd5ff",
                      borderRadius: 10,
                      padding: "3px 12px",
                    }}
                    labelStyle={{ color: "#5e4bff", fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-around mt-4 text-sm text-gray-700">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}></span>
                    <span className="font-medium font-[inter] text-[#2e0f66]">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* </div> */}
            </CardContent>
          </Card>

          {/* PROJECT PROGRESS */}
          <Card className="border-2 border-[#c3b4fe]">
            <CardHeader>
              <CardTitle className="text-[#5b1eb9] tracking-[0.015rem] text-2xl font-bold font-[inter] leading-6">
                Project Progress
              </CardTitle>
              <CardDescription>
                Completion percentage for all projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={progressData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c3b4fe" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#555", fontSize: 12 }}
                    axisLine={{ stroke: "#ddd" }}
                  />
                  <YAxis
                    tick={{ fill: "#2e0f66", fontSize: 12 }}
                    axisLine={{ stroke: "#ddd" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9f9ff",
                      borderColor: "#ddd5ff",
                      borderRadius: 10,
                      padding: "6px 15px",
                    }}
                    labelStyle={{ color: "#5e4bff", fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="progress"
                    fill={"#8443f1"}
                    name="Progress (%)"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* MONTHLY PROGRESS */}
          <Card className="lg:col-span-3 border-2 border-[#c3b4fe]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#5b1eb9] tracking-[0.015rem] text-2xl font-bold font-[inter] leading-8">
                  Progress Over Time
                </CardTitle>
                <CardDescription className="text-[#2e0f66] font-[inter] tracking-[0.025rem]">
                  Monthly progress tracking
                </CardDescription>
              </div>

              {/* SELECT PROJECT */}
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}>
                <SelectTrigger className="w-md border border-[#c3b4fe] rounded-xl focus:ring-2 focus:ring-[#c3b4fe] focus:border-[#8443f1] transition-all px-4 py-2 text-sm text-[#2e0f66] font-medium">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>

                <SelectContent className="rounded-xl border border-[#c3b4fe]">
                  <SelectItem
                    value="all"
                    className="hover:bg-[#f5f2ff] text-[#2e0f66] focus:bg-[#eae4ff] transition-all cursor-pointer">
                    All Projects
                  </SelectItem>
                  {projects.map((project) => (
                    <SelectItem
                      key={project.id}
                      value={project.id}
                      className="text-[#2e0f66] hover:bg-[#f5f2ff] focus:bg-[#eae4ff] transition-all cursor-pointer">
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={getProjectProgressData()}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c3b4fe" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#2e0f66", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#2e0f66", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9f9ff",
                      borderColor: "#ddd5ff",
                      borderRadius: 10,
                      padding: "3px 12px",
                    }}
                    labelStyle={{ color: "#5e4bff", fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />

                  {selectedProject === "all" ? (
                    projects.map((project, index) => (
                      <Line
                        key={project.id}
                        type="monotone"
                        dataKey={project.name}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke={COLORS[0]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
