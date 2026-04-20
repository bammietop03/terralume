import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Site header — mobile only; desktop uses fullscreen overlay */}
      <div className="lg:hidden">
        <Header />
      </div>

      {children}

      {/* Footer */}
      <div className="lg:hidden">
        <Footer />
      </div>
    </>
  );
}
