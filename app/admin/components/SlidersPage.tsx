"use client";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash,
  X,
  Edit,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CldUploadButton } from "next-cloudinary";
import { useToast } from "@/hooks/use-toast";
import Pagination from "@/app/(components)/Pagination";
import useAxiosInstance from "@/utils/axiosInstance";

// Enum for Integration Types
const INTEGRATION_TYPES = {
  PRODUCT: "PRODUCT",
  PACKAGE: "PACKAGE",
  URL: "URL",
} as const;

type IntegrationType = keyof typeof INTEGRATION_TYPES;

type Slider = {
  _id: string;
  name: string;
  integration_type: IntegrationType;
  image: string;
  link: string;
  status?: string;
};

type Product = {
  _id: string;
  name: string;
};

type Package = {
  _id: string;
  name: string;
};

function SliderPage() {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance()
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<Slider>>({
    name: "",
    integration_type: "PRODUCT",
    image: "",
    link: "",
  });

  const [recommendations, setRecommendations] = useState<Product[] | Package[]>(
    []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Fetch Sliders
  const {
    data: sliders,
    isLoading: slidersLoading,
    error: slidersError,
  } = useQuery({
    queryKey: ["admin-sliders", page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(`/sliders`, {
        params: { page, limit },
      });
      setCount(response?.data?.data?.options.count);
      return response.data.data.sliders as Slider[];
    },
  });

  // Search Recommendations Handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic Search Based on Integration Type
  useEffect(() => {
    if (searchTerm && formData.integration_type) {
      setIsLoading(true);
      setShowRecommendations(true);
      const delayDebounceFn = setTimeout(() => {
        fetchRecommendations();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setRecommendations([]);
      setShowRecommendations(false);
    }
  }, [searchTerm, formData.integration_type]);

  // Fetch Recommendations
  const fetchRecommendations = async () => {
    try {
      let response;
      switch (formData.integration_type) {
        case "PRODUCT":
          response = await axiosInstance.get("/products", {
            params: { search: searchTerm },
          });
          setRecommendations(response.data.data.products);
          break;
        case "PACKAGE":
          response = await axiosInstance.get("/packages", {
            params: { search: searchTerm },
          });
          setRecommendations(response.data.data.packages);
          break;
        default:
          setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getPackageOrProduct = async (id: string, integration_type: string) => {
    try {
      let response;
      switch (integration_type) {
        case "PRODUCT":
          response = await axiosInstance.get("/products" + "/" + id);
          return response.data.data.product;
          break;
        case "PACKAGE":
          response = await axiosInstance.get("/packages" + "/" + id);
          return response.data.data.Package;
          break;
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Mutations
  const createSliderMutation = useMutation({
    mutationFn: (newSlider: Slider) =>
      axiosInstance.post("/sliders", newSlider),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة البنر بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-sliders"] });
      resetForm();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة البنر",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const updateSliderMutation = useMutation({
    mutationFn: (updatedSlider: Slider) =>
      axiosInstance.put(`/sliders/${updatedSlider._id}`, updatedSlider),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحديث البنر بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-sliders"] });
      resetForm();
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث البنر",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const deleteSliderMutation = useMutation({
    mutationFn: (sliderId: string) =>
      axiosInstance.delete(`/sliders/${sliderId}`),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم حذف البنر بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-sliders"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف البنر",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Form Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIntegrationTypeChange = (value: IntegrationType) => {
    // Reset link when changing integration type
    setFormData((prev) => ({
      ...prev,
      integration_type: value,
      link: "",
    }));
    setSearchTerm("");
  };

  const handleUploadSuccess = (result: any) => {
    // Validate image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width !== 1200 || img.height < 464) {
        toast({
          title: "خطأ",
          description:
            "يجب أن تكون أبعاد الصورة 1200 عرض و464 ارتفاع على الأقل",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: result.info.secure_url,
      }));
    };
    img.src = result.info.secure_url;
  };

  const handleRecommendationSelect = (item: Product | Package) => {
    setFormData((prev) => ({
      ...prev,
      link: item._id,
    }));
    setSearchTerm(item.name);
    setShowRecommendations(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate URL for URL integration type
    if (formData.integration_type === "URL") {
      try {
        new URL(formData.link || "");
      } catch {
        toast({
          title: "خطأ",
          description: "رابط غير صالح",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }

    const sliderData: Slider = {
      name: formData.name || "",
      integration_type: formData.integration_type || "PRODUCT",
      image: formData.image || "",
      link: formData.link || "",
    } as Slider;

    if (isEditing && formData._id) {
      updateSliderMutation.mutate({
        ...sliderData,
        _id: formData._id,
      });
    } else {
      createSliderMutation.mutate(sliderData);
    }
  };

  const handleEditClick = async (slider: Slider) => {
    setFormData(slider);
    setIsEditing(true);
    if (slider.integration_type !== "URL") {
      const singleItem = await getPackageOrProduct(slider.link, slider.integration_type);
      setSearchTerm(singleItem?.name);
    } else setSearchTerm(slider.link); // Populate search term with link
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = (id: string) => {
    setSliderToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (sliderToDelete) {
      deleteSliderMutation.mutate(sliderToDelete);
      setSliderToDelete(null);
      setIsEditing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      integration_type: "PRODUCT",
      image: "",
      link: "",
    });
    setIsEditing(false);
    setSearchTerm("");
  };
  const getIntegrationTypeText = (interactionType: string): string => {
    switch (interactionType) {
      case "PRODUCT":
        return "منتج";
      case "PACKAGE":
        return "بكج";
      case "URL":
        return "رابط خارجي";
      default:
        return "بدون";
    }
  };
  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden" dir="rtl">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">
          إدارة البانرات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                اسم البنر
              </Label>
              <Input
                id="name"
                name="name"
                dir="rtl"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>

            <div>
              <Label
                htmlFor="integration_type"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                نوع التكامل
              </Label>
              <Select
                value={formData.integration_type}
                onValueChange={handleIntegrationTypeChange}
                dir="rtl"
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التكامل" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(INTEGRATION_TYPES).map((type) => (
                    <SelectItem key={type} value={type}>
                      {getIntegrationTypeText(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div ref={searchRef} className="relative">
              {formData.integration_type !== "URL" && (
                <>
                  <Label
                    htmlFor="link"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    {formData.integration_type === "PRODUCT"
                      ? "البحث عن المنتج"
                      : "البحث عن الباقة"}
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="link"
                      type="text"
                      placeholder={`ابحث عن ${formData.integration_type === "PRODUCT"
                          ? "المنتجات"
                          : "الباقات"
                        }...`}
                      value={searchTerm}
                      dir="rtl"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-right"
                    />
                    {searchTerm && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-2"
                        onClick={() => {
                          setSearchTerm("");
                          setFormData((prev) => ({
                            ...prev,
                            link: "",
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {showRecommendations && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : recommendations.length > 0 ? (
                        recommendations.map((item) => (
                          <div
                            key={item._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleRecommendationSelect(item)}
                          >
                            {item.name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          لم يتم العثور على نتائج
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {formData.integration_type === "URL" && (
                <div>
                  <Label
                    htmlFor="link"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    رابط الوجهة
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="أدخل رابط الوجهة"
                    value={formData.link}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="text-lg font-semibold">
              صورة البنر (1200x464)
            </Label>
            <div className="mt-2 flex flex-wrap gap-4  items-center">
              {formData.image ? (
                <div className="relative group">
                  <img
                    src={formData.image}
                    alt="Slider Image"
                    className="w-64 h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <CldUploadButton
                  uploadPreset="ml_default"
                  onSuccess={handleUploadSuccess}
                  className="w-64 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <ImageIcon size={24} className="mr-2" />
                  <span>رفع صورة البنر</span>
                </CldUploadButton>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple-700 text-white"
            disabled={
              createSliderMutation.isPending || updateSliderMutation.isPending
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            {isEditing
              ? updateSliderMutation.isPending
                ? "تحديث..."
                : "تحديث البنر"
              : createSliderMutation.isPending
                ? "إضافة..."
                : "إضافة سلايدر"}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            البنرات الحالية
          </h3>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <ScrollArea className="h-[400px] overflow-y-scroll scroll">
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصورة</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">نوع التكامل</TableHead>
                    <TableHead className="text-right">الرابط</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slidersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-5">
                        <div className="flex justify-center items-center space-x-2">
                          <span className="text-gray-500 text-lg">
                            ...جاري تحميل البنرات
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : slidersError ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-5 text-red-500"
                      >
                        حدث خطأ أثناء تحميل السلايدرز. يرجى المحاولة مرة أخرى
                      </TableCell>
                    </TableRow>
                  ) : (
                    sliders?.map((slider) => (
                      <TableRow key={slider._id}>
                        <TableCell className="flex items-center justify-end">
                          <img
                            src={slider.image || "/placeholder-image.jpg"}
                            alt={slider.name}
                            className="w-16 h-8 object-cover rounded ml-auto"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {slider.name}
                        </TableCell>
                        <TableCell>
                          {getIntegrationTypeText(slider.integration_type)}
                        </TableCell>
                        <TableCell>
                          {slider.integration_type === "URL"
                            ? slider.link
                            : slider.link}
                        </TableCell>
                        <TableCell>
                          <div className="flex  space-x-2 gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleEditClick(slider)}
                              disabled={updateSliderMutation.isPending}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteClick(slider._id)}
                              disabled={deleteSliderMutation.isPending}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>

        <AlertDialog
          open={!!sliderToDelete}
          onOpenChange={() => setSliderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                هل أنت متأكد أنك تريد حذف هذا السلايدر؟ هذه العملية لا يمكن
                التراجع عنها
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mr-auto">
              <AlertDialogCancel onClick={() => setSliderToDelete(null)}>
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-purple hover:bg-purple-700"
                onClick={handleConfirmDelete}
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Pagination
          currentPage={page}
          totalCount={count}
          limit={limit}
          onPageChange={(newPage) => setPage(newPage)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </CardContent>
    </Card>
  );
}

export default SliderPage;
