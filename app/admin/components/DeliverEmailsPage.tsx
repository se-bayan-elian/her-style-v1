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




type DeliverEmail = {
  _id: string;
  name: string;
  email: string;

};


function DeliverEmails() {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance()
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<DeliverEmail>>({
    name: "",
    email: "",
  });


  const [isEditing, setIsEditing] = useState(false);
  const [deliveryEmailToDelete, setDeliveryEmailToDelete] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Fetch deliverEmails
  const {
    data: deliverEmails,
    isLoading: deliverEmailsLoading,
    error: deliverEmailsError,
  } = useQuery({
    queryKey: ["admin-deliverEmails", page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(`/deliver-emails`, {
        params: { page, limit },
      });
      setCount(response?.data?.data?.options.count);
      return response.data.data.deliveryEmails as DeliverEmail[];
    },
  });


  // Mutations
  const createDeliverEmailMutation = useMutation({
    mutationFn: (newDeliverEmail: DeliverEmail) =>
      axiosInstance.post("/deliver-emails", newDeliverEmail),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة الإيميل بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-deliverEmails"] });
      resetForm();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الإيميل",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const updateDeliverEmailMutation = useMutation({
    mutationFn: (updatedDeliverEmail: DeliverEmail) =>
      axiosInstance.put(`/deliver-emails/${updatedDeliverEmail._id}`, updatedDeliverEmail),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحديث الإيميل بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-deliverEmails"] });
      resetForm();
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإيميل",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const deleteDeliverEmailMutation = useMutation({
    mutationFn: (EmailId: string) =>
      axiosInstance.delete(`/deliver-emails/${EmailId}`),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم حذف الإيميل بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-deliverEmails"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف الإيميل",
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




  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const deliverEmailData: DeliverEmail = {
      name: formData.name || "",
      email: formData.email || "",
    } as DeliverEmail;


    if (isEditing && formData._id) {
      updateDeliverEmailMutation.mutate({
        ...deliverEmailData,
        _id: formData._id,
      });
    } else {
      createDeliverEmailMutation.mutate(deliverEmailData);
    }
  };

  const handleEditClick = async (DeliverEmail: DeliverEmail) => {
    setFormData(DeliverEmail);
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = (id: string) => {
    setDeliveryEmailToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (deliveryEmailToDelete) {
      deleteDeliverEmailMutation.mutate(deliveryEmailToDelete);
      setDeliveryEmailToDelete(null);
      setIsEditing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden" dir="rtl">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">
          إدراة إيميلات التوصيل        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                اسم البائع
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
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                إيميل البائع
              </Label>
              <Input
                id="email"
                name="email"
                dir="rtl"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>
          </div>


          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple-700 text-white"
            disabled={
              createDeliverEmailMutation.isPending || updateDeliverEmailMutation.isPending
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            {isEditing
              ? updateDeliverEmailMutation.isPending
                ? "تحديث..."
                : "تحديث الإيميل"
              : createDeliverEmailMutation.isPending
                ? "إضافة..."
                : "إضافة إيميل"}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            الإيميلات الحالية
          </h3>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <Table dir="rtl" className="h-[400px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right w-auto" >الاسم</TableHead>
                  <TableHead className="text-right">الإيميل</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliverEmailsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-5">
                      <div className="flex justify-center items-center space-x-2">
                        <span className="text-gray-500 text-lg">
                          ...جاري تحميل الإيميلات
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : deliverEmailsError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-5 text-red-500"
                    >
                      حدث خطأ أثناء تحميل السلايدرز. يرجى المحاولة مرة الإيميلات
                    </TableCell>
                  </TableRow>
                ) : (
                  deliverEmails?.map((DeliverEmail) => (
                    <TableRow key={DeliverEmail._id}>

                      <TableCell className="font-medium">
                        {DeliverEmail.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        {DeliverEmail.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex  space-x-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditClick(DeliverEmail)}
                            disabled={updateDeliverEmailMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteClick(DeliverEmail._id)}
                            disabled={deleteDeliverEmailMutation.isPending}
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
          </div>
        </div>

        <AlertDialog
          open={!!deliveryEmailToDelete}
          onOpenChange={() => setDeliveryEmailToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                هل أنت متأكد أنك تريد حذف هذا الإيميل؟ هذه العملية لا يمكن
                التراجع عنها
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mr-auto">
              <AlertDialogCancel onClick={() => setDeliveryEmailToDelete(null)}>
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

export default DeliverEmails;
