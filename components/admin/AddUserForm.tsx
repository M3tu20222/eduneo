"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { generateStudentCredentials } from "@/utils/stringUtils";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Kullanıcı adı en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  password: z.string().min(6, {
    message: "Şifre en az 6 karakter olmalıdır.",
  }),
  firstName: z.string().min(2, {
    message: "Ad en az 2 karakter olmalıdır.",
  }),
  lastName: z.string().min(2, {
    message: "Soyad en az 2 karakter olmalıdır.",
  }),
  role: z.enum(["student", "teacher", "admin"]),
  class: z.string().optional(),
  studentNumber: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Class {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
}

const MultiSelect: React.FC<{
  options: Course[];
  value: string[];
  onChange: (value: string[]) => void;
}> = ({ options, value, onChange }) => {
  const handleToggle = (courseId: string) => {
    const updatedValue = value.includes(courseId)
      ? value.filter((id) => id !== courseId)
      : [...value, courseId];
    onChange(updatedValue);
  };

  return (
    <div className="space-y-2">
      {options.map((course) => (
        <div key={course._id} className="flex items-center space-x-2">
          <Checkbox
            id={course._id}
            checked={value.includes(course._id)}
            onCheckedChange={() => handleToggle(course._id)}
          />
          <label htmlFor={course._id}>{course.name}</label>
        </div>
      ))}
    </div>
  );
};

export function AddUserForm() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "student",
      class: "",
      studentNumber: "",
      courses: [],
    },
  });

  const watchRole = form.watch("role");
  const watchFirstName = form.watch("firstName");
  const watchLastName = form.watch("lastName");
  const watchStudentNumber = form.watch("studentNumber");
  const watchClass = form.watch("class");

  useEffect(() => {
    if (
      watchRole === "student" &&
      watchFirstName &&
      watchLastName &&
      watchStudentNumber &&
      watchClass
    ) {
      const selectedClass = classes.find((c) => c._id === watchClass);
      if (selectedClass) {
        const credentials = generateStudentCredentials(
          watchFirstName,
          watchLastName,
          watchStudentNumber,
          selectedClass.name
        );

        form.setValue("email", credentials.email);
        form.setValue("username", credentials.username);
        form.setValue("password", credentials.password);
      }
    }
  }, [
    watchRole,
    watchFirstName,
    watchLastName,
    watchStudentNumber,
    watchClass,
    classes,
    form,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [classesResponse, coursesResponse] = await Promise.all([
          fetch("/api/admin/classes"),
          fetch("/api/admin/courses"),
        ]);
        const classesData = await classesResponse.json();
        const coursesData = await coursesResponse.json();

        if (Array.isArray(classesData)) {
          const validClasses = classesData
            .filter((cls) => cls && cls._id && cls.name)
            .map((cls) => ({
              _id: cls._id.toString(),
              name: cls.name,
            }));
          setClasses(validClasses);
        }

        setCourses(coursesData);
      } catch (error) {
        console.error("Veri yüklenirken hata:", error);
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Veriler yüklenirken bir hata oluştu.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/admin/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Kullanıcı başarıyla eklendi.",
        });
        form.reset();
        router.refresh();
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Hata",
          description:
            errorData.message || "Kullanıcı eklenirken bir hata oluştu.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Öğrenci</SelectItem>
                  <SelectItem value="teacher">Öğretmen</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input placeholder="Ad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Soyad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchRole === "student" && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="studentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Öğrenci Numarası</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Öğrenci Numarası"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sınıf</FormLabel>
                    <Select
                      disabled={isLoading}
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sınıf seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Controller
              name="courses"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dersler</FormLabel>
                  <MultiSelect
                    options={courses}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kullanıcı Adı</FormLabel>
              <FormControl>
                <Input
                  placeholder="kullaniciadi"
                  {...field}
                  disabled={watchRole === "student"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  {...field}
                  disabled={watchRole === "student"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  {...field}
                  disabled={watchRole === "student"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Yükleniyor..." : "Kullanıcı Ekle"}
        </Button>
      </form>
    </Form>
  );
}
