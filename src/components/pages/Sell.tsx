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
import { 
  X, 
  Car, 
  Upload, 
  MapPin, 
  DollarSign, 
  Gauge, 
  Palette,
  Settings,
  Star,
  Save,
  Eye,
  AlertTriangle,
  CheckCircle,
  LoaderCircle,
  Clock,
  Shield
} from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  price?: string;
  mileage?: string;
  condition?: string;
  description?: string;
  location?: string;
  images?: string;
}

export default function Sell() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

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
    mpgCity: "",
    mpgHighway: "",
    features: [] as string[],
    location: "",
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehicleMakes, setVehicleMakes] = useState<string[]>([]);
  const [vehicleModels, setVehicleModels] = useState<string[]>([]);
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const commonFeatures = [
    "Leather Seats", "Sunroof", "Navigation System", "Bluetooth", "Backup Camera",
    "Apple CarPlay", "Android Auto", "Lane Departure Warning", "Adaptive Cruise Control",
    "Blind Spot Monitoring", "Parking Sensors", "Heated Seats", "Ventilated Seats",
    "Premium Sound System", "Wireless Charging", "Keyless Entry", "Push Button Start",
    "Dual Zone Climate Control", "Power Liftgate", "Panoramic Roof", "Heads-up Display",
    "360° Camera", "Automatic Emergency Braking", "Forward Collision Warning", "Rear Cross Traffic Alert"
  ];

  const steps = [
    { id: 1, title: "Basic Info", icon: Car, description: "Essential vehicle details" },
    { id: 2, title: "Specifications", icon: Settings, description: "Technical specifications" },
    { id: 3, title: "Features & Photos", icon: Star, description: "Features and images" },
    { id: 4, title: "Review", icon: Eye, description: "Final review" }
  ];

  // Validation rules for mandatory fields
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'make':
        return !value ? 'Vehicle make is required' : '';
      case 'model':
        return !value ? 'Vehicle model is required' : '';
      case 'year':
        return !value ? 'Year is required' : '';
      case 'price':
        if (!value) return 'Price is required';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Price must be a valid positive number';
        return '';
      case 'mileage':
        if (!value) return 'Mileage is required';
        if (isNaN(Number(value)) || Number(value) < 0) return 'Mileage must be a valid number';
        return '';
      case 'condition':
        return !value ? 'Vehicle condition is required' : '';
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 20) return 'Description must be at least 20 characters';
        return '';
      case 'location':
        return !value ? 'Location is required' : '';
      default:
        return '';
    }
  };

  // Validate all mandatory fields
  const validateForm = (): boolean => {
    const mandatoryFields = ['make', 'model', 'year', 'price', 'mileage', 'condition', 'description', 'location'];
    const newErrors: FormErrors = {};
    
    mandatoryFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    // Validate images
    if (imagePreviews.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur for real-time validation
  const handleFieldBlur = (name: string, value: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Calculate completion progress
  useEffect(() => {
    const requiredFields = ['make', 'model', 'year', 'price', 'mileage', 'condition', 'description', 'location'];
    const filledFields = requiredFields.filter(field => formData[field as keyof typeof formData]);
    const imageScore = imagePreviews.length > 0 ? 1 : 0;
    const progress = ((filledFields.length + imageScore) / (requiredFields.length + 1)) * 100;
    setCompletionProgress(progress);
  }, [formData, imagePreviews]);

  // Fetch unique makes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const countResponse = await fetch(
          'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=make&group_by=make&limit=1'
        );
        const countData = await countResponse.json();
        const totalCount = countData.total_count;

        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=make&group_by=make&limit=${totalCount}`
        );
        const data = await response.json();
        const makes = data.results
          .map((item: { make: string }) => item.make)
          .filter((make: string) => make && make.trim() !== '')
          .sort((a: string, b: string) => a.localeCompare(b));
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
        const countResponse = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=model&where=make="${encodeURIComponent(formData.make)}"&group_by=model&limit=1`
        );
        const countData = await countResponse.json();
        const totalCount = countData.total_count;

        const response = await fetch(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=model&where=make="${encodeURIComponent(formData.make)}"&group_by=model&limit=${totalCount}`
        );
        const data = await response.json();
        const models = data.results
          .map((item: { model: string }) => item.model)
          .filter((model: string) => model && model.trim() !== '')
          .sort((a: string, b: string) => a.localeCompare(b));
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
          setVehicleSpecs(specs);

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
    
    // Validate entire form before submission
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix all validation errors before submitting.",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      let imageUrl = '';
      if (imagePreviews.length > 0) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imagePreviews[0].file);
        });
      }

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
        status: "PENDING",
        trim: formData.trim,
        color: formData.color,
        engine: formData.engine,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        drivetrain: formData.drivetrain,
        horsepower: formData.horsepower,
        torque: formData.torque,
        mpgCity: formData.mpgCity,
        mpgHighway: formData.mpgHighway,
        features: formData.features,
        description: formData.description,
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

      toast.success("Car Listed Successfully", {
        description: "Your car has been submitted for review and will be active once approved.",
      });

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
        toast.error("Too many images", {
          description: "You can only upload up to 20 images"
        });
        return;
      }

      const newPreviews = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0
      }));

      setImagePreviews(prev => [...prev, ...newPreviews]);
      
      // Clear image error if images are added
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      
      // Add error if no images left
      if (newPreviews.length === 0) {
        setErrors(prevErrors => ({ ...prevErrors, images: 'At least one image is required' }));
      }
      
      return newPreviews;
    });
  };

  const handleMakeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      make: value,
      model: "",
    }));
    handleFieldBlur('make', value);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      handleFieldBlur(name, value);
    }
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

  // Handle step navigation with validation
  const handleStepChange = (newStep: number) => {
    if (newStep > currentStep) {
      // Validate current step before moving forward
      let canProceed = true;
      
      if (currentStep === 1) {
        const step1Fields = ['make', 'model', 'year', 'price', 'mileage', 'condition', 'description', 'location'];
        const step1Errors: FormErrors = {};
        
        step1Fields.forEach(field => {
          const error = validateField(field, formData[field as keyof typeof formData] as string);
          if (error) {
            step1Errors[field as keyof FormErrors] = error;
            canProceed = false;
          }
        });
        
        setErrors(prev => ({ ...prev, ...step1Errors }));
        
        if (!canProceed) {
          toast.error("Please complete all required fields", {
            description: "Fill in all mandatory fields before proceeding to the next step."
          });
          return;
        }
      }
      
      if (currentStep === 3 && newStep === 4) {
        // Validate images before going to review
        if (imagePreviews.length === 0) {
          setErrors(prev => ({ ...prev, images: 'At least one image is required' }));
          toast.error("Images required", {
            description: "Please upload at least one image of your vehicle."
          });
          return;
        }
      }
    }
    
    setCurrentStep(newStep);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [imagePreviews]);

  const isAdminRole = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

  if (!isPending && isAdminRole) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            Administrators cannot list cars for sale. This feature is restricted to regular users only.
          </p>
          <Button onClick={() => router.push('/')} variant="outline">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sell Your Car</h1>
          <p className="text-gray-500">List your vehicle with our comprehensive selling platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-2 bg-green-50 text-green-700 border-green-200">
            <Clock className="w-4 h-4 mr-2" />
            {Math.round(completionProgress)}% Complete
          </Badge>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Listing Progress</h3>
            <span className="text-sm text-gray-500">{Math.round(completionProgress)}% Complete</span>
          </div>
          <Progress value={completionProgress} className="h-2 mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  currentStep === step.id
                    ? 'bg-blue-50 border border-blue-200'
                    : currentStep > step.id
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
                onClick={() => handleStepChange(step.id)}
              >
                <step.icon className={`w-5 h-5 ${
                  currentStep === step.id
                    ? 'text-blue-600'
                    : currentStep > step.id
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`} />
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Safety Notice</AlertTitle>
        <AlertDescription>
          Please be cautious when selling your car. Never share sensitive information or accept payments outside of our platform. 
          We recommend meeting in a safe, public location and verifying the buyer&apos;s identity.
        </AlertDescription>
      </Alert>

      {/* Main Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-6 h-6" />
                Vehicle Listing Form
              </CardTitle>
              <CardDescription>
                Complete all sections to create a comprehensive listing for your vehicle
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={`step-${currentStep}`} onValueChange={(value) => handleStepChange(parseInt(value.split('-')[1]))}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 rounded-lg">
                {steps.map((step) => (
                  <TabsTrigger
                    key={step.id}
                    value={`step-${step.id}`}
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                  >
                    <step.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Step 1: Basic Info */}
              <TabsContent value="step-1" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">Vehicle Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="make">Make *</Label>
                          <Select
                            value={formData.make}
                            onValueChange={handleMakeChange}
                          >
                            <SelectTrigger className={errors.make ? 'border-red-500' : ''}>
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
                          {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model *</Label>
                          <Select
                            value={formData.model}
                            onValueChange={(value) => {
                              handleFieldChange('model', value);
                              handleFieldBlur('model', value);
                            }}
                            disabled={!formData.make}
                          >
                            <SelectTrigger className={errors.model ? 'border-red-500' : ''}>
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
                          {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year *</Label>
                          <Select
                            value={formData.year}
                            onValueChange={(value) => {
                              handleFieldChange('year', value);
                              handleFieldBlur('year', value);
                            }}
                          >
                            <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
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
                          {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition *</Label>
                          <Select
                            value={formData.condition}
                            onValueChange={(value) => {
                              handleFieldChange('condition', value);
                              handleFieldBlur('condition', value);
                            }}
                          >
                            <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
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
                          {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">Pricing & Usage</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="Enter price"
                          value={formData.price}
                          onChange={(e) => handleFieldChange('price', e.target.value)}
                          onBlur={(e) => handleFieldBlur('price', e.target.value)}
                          className={errors.price ? 'border-red-500' : ''}
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mileage">Mileage *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="mileage"
                            type="number"
                            value={formData.mileage}
                            onChange={(e) => handleFieldChange('mileage', e.target.value)}
                            onBlur={(e) => handleFieldBlur('mileage', e.target.value)}
                            className={errors.mileage ? 'border-red-500' : ''}
                          />
                          <Select
                            value={formData.distanceUnit}
                            onValueChange={(value) => handleFieldChange('distanceUnit', value)}
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
                        {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold">Location & Description</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={`w-full justify-between ${errors.location ? 'border-red-500' : ''}`}
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
                                      handleFieldChange('location', currentValue);
                                      handleFieldBlur('location', currentValue);
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
                      {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        onBlur={(e) => handleFieldBlur('description', e.target.value)}
                        rows={4}
                        placeholder="Describe your car's features, history, and any other relevant details... (minimum 20 characters)"
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                      <p className="text-xs text-gray-500">{formData.description.length}/20 minimum characters</p>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className="flex items-center gap-2"
                  >
                    Next: Specifications
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Step 2: Specifications */}
              <TabsContent value="step-2" className="mt-6 space-y-6">
                {isLoadingVehicles && (
                  <Card className="p-6">
                    <div className="text-center">
                      <LoaderCircle className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Loading vehicle specifications...</p>
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold">Appearance</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="trim">Trim</Label>
                        <Input
                          id="trim"
                          value={formData.trim}
                          onChange={(e) => handleFieldChange('trim', e.target.value)}
                          placeholder="Enter trim level"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Select
                          value={formData.color}
                          onValueChange={(value) => handleFieldChange('color', value)}
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
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">Mechanical</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="transmission">Transmission</Label>
                        <Select
                          value={formData.transmission}
                          onValueChange={(value) => handleFieldChange('transmission', value)}
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
                          onValueChange={(value) => handleFieldChange('fuelType', value)}
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
                  </Card>
                </div>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Gauge className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">Performance</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="engine">Engine</Label>
                      <Input
                        id="engine"
                        value={formData.engine}
                        onChange={(e) => handleFieldChange('engine', e.target.value)}
                        placeholder="e.g., 2.5L 4-Cylinder"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drivetrain">Drivetrain</Label>
                      <Select
                        value={formData.drivetrain}
                        onValueChange={(value) => handleFieldChange('drivetrain', value)}
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
                    <div className="space-y-2">
                      <Label htmlFor="horsepower">Horsepower</Label>
                      <Input
                        id="horsepower"
                        value={formData.horsepower}
                        onChange={(e) => handleFieldChange('horsepower', e.target.value)}
                        placeholder="e.g., 203 hp"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="torque">Torque</Label>
                      <Input
                        id="torque"
                        value={formData.torque}
                        onChange={(e) => handleFieldChange('torque', e.target.value)}
                        placeholder="e.g., 184 lb-ft"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Fuel Economy</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mpgCity">City MPG</Label>
                      <Input
                        id="mpgCity"
                        type="number"
                        value={formData.mpgCity}
                        onChange={(e) => handleFieldChange('mpgCity', e.target.value)}
                        placeholder="e.g., 25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mpgHighway">Highway MPG</Label>
                      <Input
                        id="mpgHighway"
                        type="number"
                        value={formData.mpgHighway}
                        onChange={(e) => handleFieldChange('mpgHighway', e.target.value)}
                        placeholder="e.g., 35"
                      />
                    </div>
                  </div>
                </Card>

                {vehicleSpecs && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Additional Specifications</h3>
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
                      {vehicleSpecs.seating_capacity && (
                        <div className="space-y-1">
                          <Label>Seating Capacity</Label>
                          <p className="text-sm text-muted-foreground">{vehicleSpecs.seating_capacity} seats</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2"
                  >
                    <Car className="w-4 h-4" />
                    Back: Basic Info
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleStepChange(3)}
                    className="flex items-center gap-2"
                  >
                    Next: Features & Photos
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Step 3: Features & Photos */}
              <TabsContent value="step-3" className="mt-6 space-y-6">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold">Vehicle Features</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonFeatures.map((feature) => (
                      <div
                        key={feature}
                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.features.includes(feature)
                            ? "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                            : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => handleFeatureToggle(feature)}
                      >
                        <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                          formData.features.includes(feature)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}>
                          {formData.features.includes(feature) && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">Vehicle Photos *</h3>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {imagePreviews.length}/20 images
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                      errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">Upload Vehicle Photos</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Add up to 20 high-quality photos of your vehicle
                      </p>
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Photos
                      </Button>
                    </div>
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={preview.preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2 bg-blue-600">
                                Main Photo
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Back: Specifications
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleStepChange(4)}
                    className="flex items-center gap-2"
                  >
                    Review Listing
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Step 4: Review */}
              <TabsContent value="step-4" className="mt-6 space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xl font-semibold">Review Your Listing</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Vehicle Information</h4>
                        <div className="mt-2 space-y-2 text-sm">
                          <p><span className="font-medium">Title:</span> {formData.year} {formData.make} {formData.model}</p>
                          <p><span className="font-medium">Price:</span> ${formData.price}</p>
                          <p><span className="font-medium">Mileage:</span> {formData.mileage} {formData.distanceUnit}</p>
                          <p><span className="font-medium">Condition:</span> {formData.condition}</p>
                          <p><span className="font-medium">Location:</span> {formData.location}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-gray-900">Specifications</h4>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          {formData.transmission && <p><span className="font-medium">Transmission:</span> {formData.transmission}</p>}
                          {formData.fuelType && <p><span className="font-medium">Fuel Type:</span> {formData.fuelType}</p>}
                          {formData.engine && <p><span className="font-medium">Engine:</span> {formData.engine}</p>}
                          {formData.drivetrain && <p><span className="font-medium">Drivetrain:</span> {formData.drivetrain}</p>}
                          {formData.color && <p><span className="font-medium">Color:</span> {formData.color}</p>}
                          {formData.trim && <p><span className="font-medium">Trim:</span> {formData.trim}</p>}
                        </div>
                      </div>

                      {formData.features.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold text-gray-900">Features ({formData.features.length})</h4>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {formData.features.map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-gray-900">Description</h4>
                        <p className="mt-2 text-sm text-gray-600">{formData.description}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Photos ({imagePreviews.length})</h4>
                      {imagePreviews.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {imagePreviews.slice(0, 4).map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={preview.preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {index === 0 && (
                                <Badge className="absolute top-2 left-2 bg-blue-600 text-xs">
                                  Main
                                </Badge>
                              )}
                            </div>
                          ))}
                          {imagePreviews.length > 4 && (
                            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-sm text-gray-500">+{imagePreviews.length - 4} more</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-sm text-gray-500">No photos uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Ready to Submit</AlertTitle>
                    <AlertDescription>
                      Your listing will be submitted for review and will become active once approved by our team. 
                      This typically takes 24-48 hours.
                    </AlertDescription>
                  </Alert>
                </Card>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Back: Features & Photos
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {isUploading ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Submit Listing
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
