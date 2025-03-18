
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";

const PersonalizacionTemas = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-8 pt-[var(--header-height)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Temas</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personalización del Tema</CardTitle>
                <CardDescription>
                  Personaliza los colores y el aspecto visual de tu CRM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeCustomizer />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalizacionTemas;
