import { SignUp } from "@clerk/clerk-react";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] pt-20 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          appearance={{
            elements: {
              card: "bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]",
              headerTitle:
                "text-white font-black uppercase tracking-tighter text-2xl",
              headerSubtitle: "text-gray-400 font-mono text-xs",
              formButtonPrimary:
                "bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-full transition-all",
              formFieldLabel:
                "text-gray-300 uppercase text-[10px] tracking-widest font-bold",
              formFieldInput:
                "bg-[#050505] border border-white/10 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-500 font-mono text-xs",
              socialButtonsBlockButton:
                "border border-white/10 text-gray-300 hover:bg-white/5 transition-colors",
              socialButtonsBlockButtonText:
                "font-bold tracking-widest text-[10px] uppercase",
              footerActionLink:
                "text-purple-400 hover:text-purple-300 font-bold",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Register;
