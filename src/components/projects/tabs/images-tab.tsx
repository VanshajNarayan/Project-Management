"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImagesTabProps {
  images: string[];
}

export default function ImagesTab({ images }: ImagesTabProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setSelectedImage(images[(currentIndex + 1) % images.length]);
    } else {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setSelectedImage(
        images[(currentIndex - 1 + images.length) % images.length]
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-[#2e0f66]">Project Images</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-[#c3b4fe] text-[#2e0f66]">
          Upload New
        </Button>
      </div>

      {images.length === 0 ? (
        <Card className="border-2 border-[#c3b4fe]">
          <CardContent className="flex items-center justify-center h-40 text-[#2e0f66]">
            No images available for this project
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  className="aspect-square rounded-md overflow-hidden cursor-pointer border-2 border-[#c3b4fe] hover:opacity-90 transition-opacity"
                  onClick={() => openImage(image, index)}>
                  <img
                    src={image}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden">
                {/* Add a DialogTitle inside DialogHeader to remove the accessibility warning */}
                <DialogHeader>
                  <DialogTitle>
                    <VisuallyHidden>Image Preview</VisuallyHidden>
                  </DialogTitle>
                </DialogHeader>

                <div className="relative border-2 border-[#c3b4fe]">
                  <img
                    src={selectedImage || images[currentIndex]}
                    alt="Project image full view"
                    className="w-full h-auto max-h-[80vh] object-cover"
                  />

                  {/* Navigation buttons slider */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage("prev");
                        }}>
                        <ChevronLeft className="size-6 text-[#2e0f66] cursor-pointer" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage("next");
                        }}>
                        <ChevronRight className="size-6 text-[#2e0f66] cursor-pointer" />
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}
