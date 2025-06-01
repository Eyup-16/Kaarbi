'use client'
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ImagePreview {
  file: File;
  preview: string;
  progress: number;
}

export default function Sell() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    distanceUnit: "miles",
    condition: "",
    description: "",
    trim: "",
    color: "",
    transmission: "",
    fuelType: "",
    engine: "",
    horsepower: "",
    torque: "",
    drivetrain: "",
    features: [] as string[],
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const makes = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac",
    "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC",
    "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover",
    "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini",
    "Mitsubishi", "Nissan", "Porsche", "Ram", "Rolls-Royce", "Subaru", "Tesla", "Toyota",
    "Volkswagen", "Volvo"
  ];

  const modelsByMake: { [key: string]: string[] } = {
    "Acura": ["ILX", "MDX", "NSX", "RDX", "RLX", "TLX"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
    "Aston Martin": ["DB11", "DBX", "DBS", "Vantage"],
    "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "e-tron", "Q3", "Q5", "Q7", "Q8", "R8", "RS", "S", "TT"],
    "BMW": ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "M", "X1", "X3", "X5", "X7", "Z4"],
    "Chevrolet": ["Blazer", "Camaro", "Corvette", "Equinox", "Malibu", "Silverado", "Suburban", "Tahoe", "Traverse"],
    "Ford": ["Bronco", "Escape", "Explorer", "F-150", "Mustang", "Ranger"],
    "Honda": ["Accord", "Civic", "CR-V", "HR-V", "Odyssey", "Pilot"],
    "Hyundai": ["Elantra", "Kona", "Palisade", "Santa Fe", "Sonata", "Tucson"],
    "Kia": ["Forte", "K5", "Sorento", "Sportage", "Telluride"],
    "Lexus": ["ES", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "UX"],
    "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "G-Class", "GLC", "GLE", "S-Class"],
    "Nissan": ["Altima", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
    "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
    "Toyota": ["4Runner", "Camry", "Corolla", "Highlander", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra"],
    "Volkswagen": ["Arteon", "Atlas", "Golf", "Jetta", "Passat", "Tiguan"]
  };

  const commonFeatures = [
    "Leather Seats",
    "Sunroof",
    "Navigation System",
    "Bluetooth",
    "Backup Camera",
    "Apple CarPlay",
    "Android Auto",
    "Lane Departure Warning",
    "Adaptive Cruise Control",
    "Blind Spot Monitoring",
    "Parking Sensors",
    "Heated Seats",
    "Ventilated Seats",
    "Premium Sound System",
    "Wireless Charging",
    "Keyless Entry",
    "Push Button Start",
    "Dual Zone Climate Control",
    "Power Liftgate",
    "Panoramic Roof",
    "Heads-up Display",
    "360° Camera",
    "Automatic Emergency Braking",
    "Forward Collision Warning",
    "Rear Cross Traffic Alert"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    const uploadPromises = imagePreviews.map((preview, index) => {
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setImagePreviews(prev => 
            prev.map((p, i) => 
              i === index ? { ...p, progress } : p
            )
          );
          if (progress >= 100) {
            clearInterval(interval);
            resolve(true);
          }
        }, 200);
      });
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
    console.log({ ...formData, images: imagePreviews.map(p => p.file) });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      if (imagePreviews.length + newFiles.length > 20) {
        alert("You can only upload up to 20 images");
        return;
      }

      const newPreviews = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0
      }));

      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleMakeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      make: value,
      model: "",
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [imagePreviews]);

  return (
    <div className="container mx-auto py-10">
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Fraud Warning</AlertTitle>
        <AlertDescription>
          Please be cautious when selling your car. Never share sensitive information or accept payments outside of our platform. 
          We recommend meeting in a safe, public location and verifying the buyer&apos;s identity. 
          If you suspect any fraudulent activity, please report it immediately.
        </AlertDescription>
      </Alert>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Sell Your Car</CardTitle>
          <CardDescription>
            Fill out the form below to list your car for sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100/50 rounded-lg">
                <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="specifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                  Features
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Select
                      value={formData.make}
                      onValueChange={handleMakeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {makes.map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, model: value }))
                      }
                      disabled={!formData.make}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !formData.make 
                            ? "Select make first" 
                            : "Select model"
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {formData.make && modelsByMake[formData.make]?.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, year: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, price: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <div className="flex gap-2">
                      <Input
                        id="mileage"
                        type="number"
                        value={formData.mileage}
                        onChange={(e) =>
                          setFormData(prev => ({ ...prev, mileage: e.target.value }))
                        }
                        required
                      />
                      <Select
                        value={formData.distanceUnit}
                        onValueChange={(value) =>
                          setFormData(prev => ({ ...prev, distanceUnit: value }))
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="miles">Miles</SelectItem>
                          <SelectItem value="km">KM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, condition: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="very-good">Very Good</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, description: e.target.value }))
                    }
                    required
                    rows={4}
                    placeholder="Describe your car's features, history, and any other relevant details..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trim">Trim</Label>
                    <Input
                      id="trim"
                      value={formData.trim}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, trim: e.target.value }))
                      }
                      placeholder="Enter trim level"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, color: e.target.value }))
                      }
                      placeholder="Enter color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, transmission: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                        <SelectItem value="DCT">DCT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, fuelType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engine">Engine</Label>
                    <Input
                      id="engine"
                      value={formData.engine}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, engine: e.target.value }))
                      }
                      placeholder="e.g., 2.5L 4-Cylinder"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drivetrain">Drivetrain</Label>
                    <Select
                      value={formData.drivetrain}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, drivetrain: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select drivetrain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
                        <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
                        <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
                        <SelectItem value="4WD">Four-Wheel Drive (4WD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horsepower">Horsepower</Label>
                    <Input
                      id="horsepower"
                      value={formData.horsepower}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, horsepower: e.target.value }))
                      }
                      placeholder="e.g., 203 hp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="torque">Torque</Label>
                    <Input
                      id="torque"
                      value={formData.torque}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, torque: e.target.value }))
                      }
                      placeholder="e.g., 184 lb-ft"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {commonFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      <div className={`h-4 w-4 rounded border ${
                        formData.features.includes(feature)
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}>
                        {formData.features.includes(feature) && (
                          <X className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="images">Images</Label>
                <span className="text-sm text-muted-foreground">
                  {imagePreviews.length}/20 images
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={preview.preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      {preview.progress > 0 && preview.progress < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
                          <Progress value={preview.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {imagePreviews.length < 20 && (
                  <div
                    className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center p-4">
                      <div className="text-2xl mb-2">+</div>
                      <div className="text-sm text-muted-foreground">
                        Add Image
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <p className="text-sm text-muted-foreground">
                Upload up to 20 images (max 5MB each). Supported formats: JPG, PNG, WEBP
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || imagePreviews.length === 0}
            >
              {isUploading ? "Uploading..." : "List Car for Sale"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}