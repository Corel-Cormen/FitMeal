"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  X,
  AlertCircle,
  Heart,
  Ban,
  Leaf,
  Milk,
  Wheat,
  Fish,
  Egg,
  Nut
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const allergenIcons: { [key: string]: React.ElementType } = {
  "Laktoza": Milk,
  "Gluten": Wheat,
  "Ryby": Fish,
  "Jaja": Egg,
  "Orzechy": Nut,
}

const availableAllergens = [
  { id: "laktoza", name: "Laktoza", icon: Milk },
  { id: "gluten", name: "Gluten", icon: Wheat },
  { id: "ryby", name: "Ryby", icon: Fish },
  { id: "jaja", name: "Jaja", icon: Egg },
  { id: "orzechy", name: "Orzechy", icon: Nut },
  { id: "soja", name: "Soja", icon: Leaf },
  { id: "skorupiaki", name: "Skorupiaki", icon: Fish },
  { id: "seler", name: "Seler", icon: Leaf },
]

const availableIngredients = [
  "Kurczak", "Wolowina", "Wieprzowina", "Indyk", "Losos", "Tunczyk", "Krewetki",
  "Ryz", "Makaron", "Ziemniaki", "Quinoa", "Kasza gryczana", "Bulgur",
  "Brokuly", "Szpinak", "Pomidory", "Papryka", "Cukinia", "Baklazan",
  "Awokado", "Jajka", "Tofu", "Ser feta", "Mozzarella", "Parmezan",
  "Ciecierzyca", "Fasola", "Soczewica", "Edamame", "Groszek",
  "Orzechy wloskie", "Migdaly", "Orzechy nerkowca", "Pestki slonecznika"
]

export function PreferencesPanel() {
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>(["laktoza", "orzechy"])
  const [favoriteIngredients, setFavoriteIngredients] = useState<string[]>(["Kurczak", "Losos", "Awokado", "Brokuly"])
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>(["Wieprzowina", "Baklazan"])
  const [searchQuery, setSearchQuery] = useState("")

  const [dietPreferences, setDietPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lactoseFree: true,
    keto: false,
    highProtein: true,
  })

  const toggleAllergen = (id: string) => {
    setExcludedAllergens(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const addFavorite = (ingredient: string) => {
    if (!favoriteIngredients.includes(ingredient)) {
      setFavoriteIngredients(prev => [...prev, ingredient])
      setExcludedIngredients(prev => prev.filter(i => i !== ingredient))
    }
  }

  const removeFavorite = (ingredient: string) => {
    setFavoriteIngredients(prev => prev.filter(i => i !== ingredient))
  }

  const addExcluded = (ingredient: string) => {
    if (!excludedIngredients.includes(ingredient)) {
      setExcludedIngredients(prev => [...prev, ingredient])
      setFavoriteIngredients(prev => prev.filter(i => i !== ingredient))
    }
  }

  const removeExcluded = (ingredient: string) => {
    setExcludedIngredients(prev => prev.filter(i => i !== ingredient))
  }

  const filteredIngredients = availableIngredients.filter(ing =>
    ing.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !favoriteIngredients.includes(ing) &&
    !excludedIngredients.includes(ing)
  )

  const handleSavePreferences = () => {
    toast.success("Preferencje zostały pomyślnie zapisane!", {
      description: "Twoje ustawienia żywieniowe zostały zaktualizowane.",
      duration: 3000,
    })
  }

  return (
    <section id="preferences" className="scroll-mt-20">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Preferencje zywieniowe</CardTitle>
          <CardDescription>
            Dostosuj swoja diete do swoich potrzeb i preferencji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diet" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="diet">Dieta</TabsTrigger>
              <TabsTrigger value="allergens">Alergeny</TabsTrigger>
              <TabsTrigger value="ingredients">Skladniki</TabsTrigger>
            </TabsList>

            <TabsContent value="diet" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(dietPreferences).map(([key, value]) => {
                  const labels: { [key: string]: { title: string, desc: string } } = {
                    vegetarian: { title: "Wegetarianska", desc: "Bez miesa" },
                    vegan: { title: "Weganska", desc: "Bez produktow odzwierzecych" },
                    glutenFree: { title: "Bez glutenu", desc: "Dla osob z celiakia" },
                    lactoseFree: { title: "Bez laktozy", desc: "Bez nabialau" },
                    keto: { title: "Keto", desc: "Nisko weglowodanowa" },
                    highProtein: { title: "High Protein", desc: "Wysoko bialkowa" },
                  }
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                        value ? "border-primary bg-primary/5" : "border-border/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          value ? "bg-primary/20" : "bg-secondary"
                        }`}>
                          <Leaf className={`h-5 w-5 ${value ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <Label htmlFor={key} className="font-medium">{labels[key].title}</Label>
                          <p className="text-xs text-muted-foreground">{labels[key].desc}</p>
                        </div>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setDietPreferences(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="allergens" className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-foreground">Informacja o alergenach</p>
                    <p className="text-sm text-muted-foreground">
                      Zaznacz alergeny, ktorych chcesz unikac. Posilki zawierajace te skladniki nie beda uwzgledniane w Twoim menu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {availableAllergens.map((allergen) => {
                  const isExcluded = excludedAllergens.includes(allergen.id)
                  const Icon = allergen.icon

                  return (
                    <button
                      key={allergen.id}
                      onClick={() => toggleAllergen(allergen.id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                        isExcluded
                          ? "border-destructive/50 bg-destructive/10"
                          : "border-border/50 hover:border-border hover:bg-secondary/50"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isExcluded ? "bg-destructive/20" : "bg-secondary"
                      }`}>
                        <Icon className={`h-5 w-5 ${isExcluded ? "text-destructive" : "text-muted-foreground"}`} />
                      </div>
                      <span className="font-medium text-foreground">{allergen.name}</span>
                      {isExcluded && (
                        <Badge variant="destructive" className="ml-auto">
                          <Ban className="mr-1 h-3 w-3" />
                          Wykluczone
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Ulubione skladniki</h3>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Dodaj
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dodaj ulubiony skladnik</DialogTitle>
                        <DialogDescription>
                          Wybierz skladniki, ktore chcesz czesciej widziec w swoich posilkach
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="Szukaj skladnika..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-1">
                          {filteredIngredients.map((ingredient) => (
                            <button
                              key={ingredient}
                              onClick={() => addFavorite(ingredient)}
                              className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                            >
                              <span>{ingredient}</span>
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteIngredients.map((ingredient) => (
                    <Badge
                      key={ingredient}
                      variant="secondary"
                      className="gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <Heart className="h-3 w-3" />
                      {ingredient}
                      <button
                        onClick={() => removeFavorite(ingredient)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-foreground">Wykluczone skladniki</h3>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Dodaj
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Wyklucz skladnik</DialogTitle>
                        <DialogDescription>
                          Wybierz skladniki, ktorych nie chcesz widziec w swoich posilkach
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="Szukaj skladnika..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-1">
                          {filteredIngredients.map((ingredient) => (
                            <button
                              key={ingredient}
                              onClick={() => addExcluded(ingredient)}
                              className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-secondary"
                            >
                              <span>{ingredient}</span>
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {excludedIngredients.map((ingredient) => (
                    <Badge
                      key={ingredient}
                      variant="secondary"
                      className="gap-1 bg-destructive/10 text-destructive hover:bg-destructive/20"
                    >
                      <Ban className="h-3 w-3" />
                      {ingredient}
                      <button
                        onClick={() => removeExcluded(ingredient)}
                        className="ml-1 hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSavePreferences}>Zapisz preferencje</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
