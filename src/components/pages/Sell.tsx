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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreview {
  file: File;
  preview: string;
  progress: number;
}

interface MapboxFeature {
  place_name: string;
  properties: Record<string, unknown>;
  text: string;
  place_type: string[];
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

interface MapboxResponse {
  type: string;
  query: string[];
  features: MapboxFeature[];
  attribution: string;
}

interface VehicleData {
  make: string;
  model: string;
  year: number;
  transmission: string;
  fuel_type: string;
  engine_size: string;
  horsepower: number;
  torque: number;
  drivetrain: string;
  trim: string;
  body_style: string;
  doors: number;
  cylinders: number;
  displacement: number;
  fuel_injection: string;
  fuel_tank_capacity: number;
  wheelbase: number;
  length: number;
  width: number;
  height: number;
  curb_weight: number;
  ground_clearance: number;
  max_cargo_capacity: number;
  seating_capacity: number;
}

export default function Sell() {
  const router = useRouter();
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
    location: "",
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehicleMakes, setVehicleMakes] = useState<string[]>([]);
  const [vehicleModels, setVehicleModels] = useState<string[]>([]);
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

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

  // Fetch unique makes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        // First, get the total count
        const countResponse = await fetch(
          'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=make&group_by=make&limit=1'
        );
        const countData = await countResponse.json();
        const totalCount = countData.total_count;

        // Then fetch all makes with the total count
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=make&group_by=make&limit=${totalCount}`
        );
        const data = await response.json();
        const makes = data.results
          .map((item: { make: string }) => item.make)
          .filter((make: string) => make && make.trim() !== '') // Filter out empty makes
          .sort((a: string, b: string) => a.localeCompare(b)); // Sort alphabetically
        setVehicleMakes(makes);
      } catch (error) {
        console.error('Error fetching makes:', error);
        toast.error("Error", {
          description: "Failed to load vehicle makes. Please try again.",
        });
      }
    };

    fetchMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.make) {
        setVehicleModels([]);
        return;
      }

      try {
        // First, get the total count for this make
        const countResponse = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=model&where=make="${encodeURIComponent(formData.make)}"&group_by=model&limit=1`
        );
        const countData = await countResponse.json();
        const totalCount = countData.total_count;

        // Then fetch all models with the total count
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=model&where=make="${encodeURIComponent(formData.make)}"&group_by=model&limit=${totalCount}`
        );
        const data = await response.json();
        const models = data.results
          .map((item: { model: string }) => item.model)
          .filter((model: string) => model && model.trim() !== '') // Filter out empty models
          .sort((a: string, b: string) => a.localeCompare(b)); // Sort alphabetically
        setVehicleModels(models);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error("Error", {
          description: "Failed to load vehicle models. Please try again.",
        });
      }
    };

    fetchModels();
  }, [formData.make]);

  // Fetch vehicle specifications when make and model are selected
  useEffect(() => {
    const fetchSpecs = async () => {
      if (!formData.make || !formData.model) {
        setVehicleSpecs(null);
        return;
      }

      setIsLoadingVehicles(true);
      try {
        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?where=make="${encodeURIComponent(formData.make)}" AND model="${encodeURIComponent(formData.model)}"&limit=1`
        );
        const data = await response.json();
        if (data.results.length > 0) {
          const specs = data.results[0];
          setVehicleSpecs({
            make: specs.make,
            model: specs.model,
            year: specs.year,
            transmission: specs.transmission,
            fuel_type: specs.fuel_type,
            engine_size: specs.engine_size,
            horsepower: specs.horsepower,
            torque: specs.torque,
            drivetrain: specs.drivetrain,
            trim: specs.trim,
            body_style: specs.body_style,
            doors: specs.doors,
            cylinders: specs.cylinders,
            displacement: specs.displacement,
            fuel_injection: specs.fuel_injection,
            fuel_tank_capacity: specs.fuel_tank_capacity,
            wheelbase: specs.wheelbase,
            length: specs.length,
            width: specs.width,
            height: specs.height,
            curb_weight: specs.curb_weight,
            ground_clearance: specs.ground_clearance,
            max_cargo_capacity: specs.max_cargo_capacity,
            seating_capacity: specs.seating_capacity
          });

          // Update form with specs
          setFormData(prev => ({
            ...prev,
            transmission: specs.transmission || prev.transmission,
            fuelType: specs.fuel_type || prev.fuelType,
            engine: specs.engine_size || prev.engine,
            horsepower: specs.horsepower?.toString() || prev.horsepower,
            torque: specs.torque?.toString() || prev.torque,
            drivetrain: specs.drivetrain || prev.drivetrain,
            trim: specs.trim || prev.trim,
          }));
        }
      } catch (error) {
        console.error('Error fetching vehicle specs:', error);
        toast.error("Error", {
          description: "Failed to load vehicle specifications. Please try again.",
        });
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchSpecs();
  }, [formData.make, formData.model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Convert first image to base64 if available
      let imageUrl = '';
      if (imagePreviews.length > 0) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imagePreviews[0].file);
        });
      }

      // Create car data object
      const carData = {
        title: `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        location: formData.location,
        imageUrl,
        condition: formData.condition,
        status: "PENDING", // Set initial status as pending
      };

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error('Failed to create car listing');
      }

      toast.success("Car Listed", {
        description: "Your car has been successfully listed for sale.",
      });

      // Use Next.js router for navigation
      router.push('/my-cars');
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error("Error", {
        description: "Failed to list your car. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
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

  const handleLocationChange = async (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    
    if (value.length >= 2) {
      setIsLoadingLocations(true);
      try {
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!mapboxToken) {
          console.error('Mapbox token is not configured');
          toast.error("Location search is not configured", {
            description: "Please contact the administrator to set up location search.",
          });
          return;
        }

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${mapboxToken}&types=place,locality,neighborhood&limit=5`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location suggestions');
        }

        const data = await response.json() as MapboxResponse;
        setLocationSuggestions(data.features.map((feature) => feature.place_name));
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        toast.error("Error", {
          description: "Failed to fetch location suggestions. Please try again.",
        });
      } finally {
        setIsLoadingLocations(false);
      }
    } else {
      setLocationSuggestions([]);
    }
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
                        {vehicleMakes.map((make) => (
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
                        {vehicleModels.map((model) => (
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

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {formData.location || "Select location..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search location..." 
                          value={formData.location}
                          onValueChange={handleLocationChange}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {isLoadingLocations ? "Loading..." : "No location found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {locationSuggestions.map((location) => (
                              <CommandItem
                                key={location}
                                value={location}
                                onSelect={(currentValue: string) => {
                                  setFormData(prev => ({ ...prev, location: currentValue }));
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.location === location ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {location}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6 space-y-6">
                {isLoadingVehicles && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading vehicle specifications...</p>
                  </div>
                )}

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
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, color: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                        <SelectItem value="Orange">Orange</SelectItem>
                        <SelectItem value="Purple">Purple</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Beige">Beige</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                        <SelectItem value="Sequential">Sequential</SelectItem>
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
                        <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                        <SelectItem value="Flex Fuel">Flex Fuel</SelectItem>
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

                {vehicleSpecs && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Additional Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {vehicleSpecs.body_style && (
                        <div className="space-y-1">
                          <Label>Body Style</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.body_style}</p>
                        </div>
                      )}
                      {vehicleSpecs.doors && (
                        <div className="space-y-1">
                          <Label>Doors</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.doors}</p>
                        </div>
                      )}
                      {vehicleSpecs.cylinders && (
                        <div className="space-y-1">
                          <Label>Cylinders</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.cylinders}</p>
                        </div>
                      )}
                      {vehicleSpecs.displacement && (
                        <div className="space-y-1">
                          <Label>Displacement</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.displacement}L</p>
                        </div>
                      )}
                      {vehicleSpecs.fuel_injection && (
                        <div className="space-y-1">
                          <Label>Fuel Injection</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.fuel_injection}</p>
                        </div>
                      )}
                      {vehicleSpecs.fuel_tank_capacity && (
                        <div className="space-y-1">
                          <Label>Fuel Tank Capacity</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.fuel_tank_capacity} gallons</p>
                        </div>
                      )}
                      {vehicleSpecs.wheelbase && (
                        <div className="space-y-1">
                          <Label>Wheelbase</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.wheelbase} inches</p>
                        </div>
                      )}
                      {vehicleSpecs.length && (
                        <div className="space-y-1">
                          <Label>Length</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.length} inches</p>
                        </div>
                      )}
                      {vehicleSpecs.width && (
                        <div className="space-y-1">
                          <Label>Width</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.width} inches</p>
                        </div>
                      )}
                      {vehicleSpecs.height && (
                        <div className="space-y-1">
                          <Label>Height</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.height} inches</p>
                        </div>
                      )}
                      {vehicleSpecs.curb_weight && (
                        <div className="space-y-1">
                          <Label>Curb Weight</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.curb_weight} lbs</p>
                        </div>
                      )}
                      {vehicleSpecs.ground_clearance && (
                        <div className="space-y-1">
                          <Label>Ground Clearance</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.ground_clearance} inches</p>
                        </div>
                      )}
                      {vehicleSpecs.max_cargo_capacity && (
                        <div className="space-y-1">
                          <Label>Max Cargo Capacity</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.max_cargo_capacity} cu ft</p>
                        </div>
                      )}
                      {vehicleSpecs.seating_capacity && (
                        <div className="space-y-1">
                          <Label>Seating Capacity</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.seating_capacity} seats</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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