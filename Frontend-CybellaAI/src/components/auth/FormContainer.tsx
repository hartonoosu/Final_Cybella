import React, { ReactNode } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface FormContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const FormContainer = ({
  title,
  subtitle,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: FormContainerProps) => {
  return (
    <Card className={`max-w-md mx-auto bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 ${className}`}>
      <CardHeader className={`text-center pb-2 ${headerClassName}`}>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-white/80">{subtitle}</p>}
      </CardHeader>
      <CardContent className={`pt-4 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormContainer;