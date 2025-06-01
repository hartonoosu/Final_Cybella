import React from "react";
import EmailVerificationCard from "./EmailVerificationCard";
import PasswordChangeCard from "./PasswordChangeCard";

const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <EmailVerificationCard />
      <PasswordChangeCard />
    </div>
  );
};

export default SecurityTab;