"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VideosTabProps {
  videos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
}

export default function VideosTab({ videos }: VideosTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#2e0f66]">Project Videos</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-[#c3b4fe] text-[#2e0f66]">
          Upload New
        </Button>
      </div>

      {videos.length === 0 ? (
        <Card className="border-2 border-[#c3b4fe]">
          <CardContent className="flex items-center justify-center h-40 text-[#2e0f66]">
            No videos available for this project
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <Card
              key={index}
              className="overflow-hidden rounded-sm border-2 border-[#c3b4fe] p-1">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                      <div className="h-14 w-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary fill-current" />
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0">
                  <DialogHeader>
                    <DialogTitle>
                      <VisuallyHidden>Image Preview</VisuallyHidden>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-2">{video.title}</h3>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      {/* In a real app, this would be an actual video player */}
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-[#2e0f66]">
                          Video player would be implemented here
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <CardContent className="p-3">
                <h4 className="font-medium truncate text-[#2e0f66]">
                  {video.title}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
