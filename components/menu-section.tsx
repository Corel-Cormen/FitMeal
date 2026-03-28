"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Wheat, Droplets } from "lucide-react"

const menuCategories = ["Wszystkie", "Masa", "Redukcja", "Keto", "Vege"]

const meals = [
  {
    name: "Power Bowl",
    description: "Kurczak grillowany, brązowy ryż, edamame, awokado, jajko",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    kcal: 650,
    protein: 45,
    carbs: 55,
    fat: 22,
    category: "Masa",
    tag: "Bestseller"
  },
  {
    name: "Stek z łososiem",
    description: "Łosoś norweski, słodkie ziemniaki, szparagi, sos koperkowy",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    kcal: 580,
    protein: 42,
    carbs: 35,
    fat: 28,
    category: "Keto",
    tag: "Omega-3"
  },
  {
    name: "Protein Salad",
    description: "Mix sałat, pierś z indyka, jajka, orzechy, dressing balsamiczny",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    kcal: 420,
    protein: 38,
    carbs: 18,
    fat: 24,
    category: "Redukcja",
    tag: "Low carb"
  },
  {
    name: "Buddha Bowl",
    description: "Ciecierzyca, quinoa, hummus, warzywa pieczone, tahini",
    image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=400&h=300&fit=crop",
    kcal: 520,
    protein: 22,
    carbs: 65,
    fat: 18,
    category: "Vege",
    tag: "Roślinne"
  },
  {
    name: "Beef & Rice",
    description: "Wołowina grass-fed, ryż jaśminowy, brokuły, sos teriyaki",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
    kcal: 720,
    protein: 52,
    carbs: 68,
    fat: 24,
    category: "Masa",
    tag: "High protein"
  },
  {
    name: "Keto Plate",
    description: "Jajecznica, bekon, awokado, warzywa liściaste, ser feta",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    kcal: 550,
    protein: 32,
    carbs: 8,
    fat: 42,
    category: "Keto",
    tag: "Bez cukru"
  }
]

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("Wszystkie")

  const filteredMeals = activeCategory === "Wszystkie"
    ? meals
    : meals.filter(meal => meal.category === activeCategory)

  return (
    <section id="menu" className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Nasze <span className="text-primary">menu</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Wybierz z naszej szerokiej gamy posiłków dopasowanych do Twoich celów treningowych.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {menuCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((meal, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground">
                  {meal.tag}
                </Badge>
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">{meal.name}</h3>
                  <Badge variant="secondary">{meal.category}</Badge>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{meal.description}</p>
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{meal.kcal}</span>
                    <span className="text-muted-foreground">kcal</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{meal.protein}g</span>
                    <span className="text-muted-foreground">B</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Wheat className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{meal.carbs}g</span>
                    <span className="text-muted-foreground">W</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
