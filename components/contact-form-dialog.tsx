"use client"

import type { ComponentProps, FormEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { Loader2, Mail, Send } from "lucide-react"
import { toastError, toastSuccess } from "@/lib/sonner-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ContactFormDialogProps = {
  toEmail?: string
  triggerVariant?: ComponentProps<typeof Button>["variant"]
  triggerClassName?: string
}

export function ContactFormDialog({
  toEmail = "pomoc@fitmeal.pl",
  triggerVariant = "outline",
  triggerClassName,
}: ContactFormDialogProps) {
  const [open, setOpen] = useState(false)
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [name, setName] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current)
    }
  }, [])

  const resetForm = () => {
    setName("")
    setFromEmail("")
    setSubject("")
    setMessage("")
    setIsSubmitting(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    if (!name.trim()) {
      toastError("Proszę wpisać imię.")
      return
    }

    if (!fromEmail.trim()) {
      toastError("Proszę wpisać email.")
      return
    }

    if (!validateEmail(fromEmail.trim())) {
      toastError("Email nie jest w prawidłowym formacie.")
      return
    }

    if (!subject.trim()) {
      toastError("Proszę wpisać temat.")
      return
    }

    if (!message.trim()) {
      toastError("Proszę wpisać wiadomość")
      return
    }

    setIsSubmitting(true)
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current)
    submitTimeoutRef.current = setTimeout(() => {
      toastSuccess("Wiadomość została wysłana. Odpowiemy jak najszybciej!")
      resetForm()
      setOpen(false)
      submitTimeoutRef.current = null
    }, 1200)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current)
        submitTimeoutRef.current = null
      }
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant ?? "outline"} className={triggerClassName ?? "gap-2"}>
          <Mail className="h-4 w-4" />
          {toEmail}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Formularz kontaktowy</DialogTitle>
          <DialogDescription>
            Masz pytania lub potrzebujesz pomocy? Napisz do nas, a my postaramy się odpowiedzieć jak najszybciej!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="contact-name">Imię</Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Np. Jan Kowalski"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              autoComplete="email"
              placeholder="Np. jan@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-subject">Temat</Label>
            <Input
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Np. Pytanie o dostawę"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-message">Wiadomość</Label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Opisz, w czym możemy pomóc"
              className="min-h-28"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Wyślij
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
