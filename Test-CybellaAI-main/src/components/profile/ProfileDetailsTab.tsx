import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// ✅ Extend the schema to include ageRange and aiName
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  gender: z.string().optional(),
  dateOfBirth: z.date().optional(),
  ageRange: z.string().optional(),
  aiName: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileDetailsTab = () => {
  const { user, updateProfile } = useAuth();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      gender: user?.gender || "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      ageRange: user?.ageRange || "",
      aiName: user?.aiName || "",
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    const formattedDob = values.dateOfBirth ? format(values.dateOfBirth, "yyyy-MM-dd") : undefined;

    const success = await updateProfile({
      fullName: values.fullName,
      gender: values.gender,
      dateOfBirth: formattedDob,
      ageRange: values.ageRange,
      aiName: values.aiName,
    });

    if (success) {
      profileForm.reset({
        ...values,
        dateOfBirth: values.dateOfBirth,
      });
    }
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30">
      <CardHeader>
        <CardTitle className="text-white">Personal Information</CardTitle>
        <CardDescription className="text-white/70">
          Update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={profileForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your full name" 
                      className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email (disabled) */}
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your email" 
                      className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                      disabled
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={profileForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Gender</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/30 text-white border-white/30">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={profileForm.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white">Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full bg-white/30 text-white border-white/30 pl-3 text-left font-normal",
                            !field.value && "text-white/60"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age Range
            <FormField
              control={profileForm.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Age Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/30 text-white border-white/30">
                        <SelectValue placeholder="Select your age range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-54">45-54</SelectItem>
                      <SelectItem value="55+">55+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} */}
            {/* /> */}

            {/* AI Assistant Name */}
            <FormField
              control={profileForm.control}
              name="aiName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">AI Assistant Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your AI assistant's name"
                      className="bg-white/30 text-white placeholder:text-white/60 border-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full mt-4" 
              variant="therapeutic"
              disabled={profileForm.formState.isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileDetailsTab;
