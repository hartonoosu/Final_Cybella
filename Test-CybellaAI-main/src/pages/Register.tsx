import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#8B5CF6] to-[#C4B5FD]">
      <Header />

      <main className="flex-1 container py-16 px-4 mt-16">
        <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create an Account</h1>
            <p className="text-lg text-white/80">Sign up to get started with Cybella</p>
          </div>

          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
