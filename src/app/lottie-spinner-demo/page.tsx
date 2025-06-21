"use client"

import React, { useEffect, useState } from 'react';
import { PageSpinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

export default function LottieSpinnerDemo() {
  const [animationData, setAnimationData] = useState(null);
  useEffect(() => {
    // Dynamically fetch the animation
    fetch('/animations/spinner.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(err => {
        console.error("Failed to load animation:", err);
      });
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Lottie Spinner Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Default Spinner</h2>
          <div className="border rounded-lg h-80 flex items-center justify-center">
            <PageSpinner message="Using default spinner..." />
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lottie Spinner</h2>
          <div className="border rounded-lg h-80 flex items-center justify-center">
            <PageSpinner 
              animationData={animationData} 
              message="Using Lottie animation..." 
            />
          </div>
        </Card>
      </div>

      <p className="mt-8 text-muted-foreground">
        To use your own Lottie animation, place the JSON file in <code className="bg-muted p-1 rounded">/public/animations/</code> 
        and import it as shown in this demo.
      </p>
    </div>
  )
}
