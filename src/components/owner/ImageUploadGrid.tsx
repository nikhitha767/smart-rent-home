import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadGridProps {
    images: File[];
    onChange: (files: File[]) => void;
    maxImages?: number;
}

const ImageUploadGrid = ({ images, onChange, maxImages = 4 }: ImageUploadGridProps) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const remainingSlots = maxImages - images.length;
            const filesToAdd = newFiles.slice(0, remainingSlots);

            const updatedImages = [...images, ...filesToAdd];
            onChange(updatedImages);

            // Create previews
            filesToAdd.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        onChange(updatedImages);

        // Update previews
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const renderSlot = (index: number) => {
        const hasImage = index < images.length;
        const preview = hasImage ? URL.createObjectURL(images[index]) : null;

        if (hasImage) {
            return (
                <div className="relative group">
                    <img
                        src={preview!}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                            Main Photo
                        </div>
                    )}
                </div>
            );
        }

        return (
            <label
                className={cn(
                    "border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
                    "hover:border-primary hover:bg-primary/5",
                    index === 0 ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25"
                )}
            >
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple={index === 0}
                    onChange={handleFileSelect}
                />
                <div className="flex flex-col items-center gap-2 p-4">
                    {index === 0 ? (
                        <>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-center">Upload Main Photo</p>
                            <p className="text-xs text-muted-foreground text-center">
                                Click or drag image
                            </p>
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Add Photo {index + 1}</p>
                        </>
                    )}
                </div>
            </label>
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                    Property Photos ({images.length}/{maxImages})
                </label>
                {images.length > 0 && images.length < maxImages && (
                    <label className="text-xs text-primary cursor-pointer hover:underline">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                        />
                        + Add more photos
                    </label>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: maxImages }).map((_, index) => (
                    <div key={index} className="aspect-square">
                        {renderSlot(index)}
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                    Upload up to {maxImages} photos. First photo will be the main display image.
                </p>
            )}
        </div>
    );
};

export default ImageUploadGrid;
