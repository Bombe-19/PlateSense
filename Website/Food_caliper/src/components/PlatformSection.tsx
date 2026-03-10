import { useEffect, useState } from "react";
import CardSwap, { Card } from "./CardSwap";

export default function PlatformSection() {

  const [activeIndex, setActiveIndex] = useState(0);

  const sections = [
    "dashboard",
    "reports",
    "insights",
    "history",
    "nutrition"
  ];

  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target.id);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();

  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-20 items-start">

      {/* LEFT SIDE TEXT */}

      <div className="space-y-32">

        <section id="dashboard" className="min-h-[70vh] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            AI Dashboard
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            View detected foods, estimated volume, weight, and nutritional
            results inside a centralized AI dashboard.
          </p>
        </section>

        <section id="reports" className="min-h-[70vh] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Food Analysis Reports
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Automatically generated reports that show food measurements,
            portion estimation, and nutrition results.
          </p>
        </section>

        <section id="insights" className="min-h-[70vh] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Data Insights
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Visual insights help understand food portion trends and nutrition
            patterns across meals.
          </p>
        </section>

        <section id="history" className="min-h-[70vh] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Scan History
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Access previously analyzed meals and track historical food
            measurements and nutrition results.
          </p>
        </section>

        <section id="nutrition" className="min-h-[70vh] flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Nutritional Analysis
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Estimate calories and macronutrients using AI detection and
            structured nutrition datasets.
          </p>
        </section>

      </div>


      {/* RIGHT SIDE CARD STACK */}

      <div className="sticky top-32 flex items-center justify-center h-[500px]">

        <CardSwap
          width={420}
          height={260}
          cardDistance={60}
          verticalDistance={70}
          activeIndex={activeIndex}
        >

          <Card>
            <h3 className="text-xl font-bold mb-2">AI Dashboard</h3>
            <p>Real-time dashboard showing food analysis results.</p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">Food Reports</h3>
            <p>Detailed reports generated after each scan.</p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">Data Insights</h3>
            <p>Analytics and trends from food measurement data.</p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">Scan History</h3>
            <p>Review previous food scans and analysis results.</p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">Nutrition Analysis</h3>
            <p>Calories and nutrient estimation from detected foods.</p>
          </Card>

        </CardSwap>

      </div>

    </div>
  );
}