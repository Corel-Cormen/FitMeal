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

  const [nameError, setNameError] = useState(false)
  const [fromEmailError, setFromEmailError] = useState(false)
  const [subjectError, setSubjectError] = useState(false)
  const [messageError, setMessageError] = useState(false)

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

    setNameError(false)
    setFromEmailError(false)
    setSubjectError(false)
    setMessageError(false)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    const trimmedName = name.trim()
    const trimmedEmail = fromEmail.trim()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    const nextNameError = !trimmedName
    const nextEmailError = !trimmedEmail || !validateEmail(trimmedEmail)
    const nextSubjectError = !trimmedSubject
    const nextMessageError = !trimmedMessage

    setNameError(nextNameError)
    setFromEmailError(nextEmailError)
    setSubjectError(nextSubjectError)
    setMessageError(nextMessageError)

    if (!trimmedName) {
      toastError("Proszę wpisać imię.")
      return
    }

    if (!trimmedEmail) {
      toastError("Proszę wpisać email.")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toastError("Email nie jest w prawidłowym formacie.")
      return
    }

    if (!trimmedSubject) {
      toastError("Proszę wpisać temat.")
      return
    }

    if (!trimmedMessage) {
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
              onChange={(e) => {
                const next = e.target.value
                setName(next)
                if (nameError && next.trim()) setNameError(false)
              }}
              autoComplete="name"
              placeholder="Np. Jan Kowalski"
              aria-invalid={nameError}
              className={nameError ? "border-destructive ring-2 ring-destructive/20" : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={fromEmail}
              onChange={(e) => {
                const next = e.target.value
                setFromEmail(next)
                if (fromEmailError && validateEmail(next.trim())) setFromEmailError(false)
              }}
              autoComplete="email"
              placeholder="Np. jan@example.com"
              aria-invalid={fromEmailError}
              className={fromEmailError ? "border-destructive ring-2 ring-destructive/20" : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-subject">Temat</Label>
            <Input
              id="contact-subject"
              value={subject}
              onChange={(e) => {
                const next = e.target.value
                setSubject(next)
                if (subjectError && next.trim()) setSubjectError(false)
              }}
              placeholder="Np. Pytanie o dostawę"
              aria-invalid={subjectError}
              className={subjectError ? "border-destructive ring-2 ring-destructive/20" : undefined}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-message">Wiadomość</Label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => {
                const next = e.target.value
                setMessage(next)
                if (messageError && next.trim()) setMessageError(false)
              }}
              placeholder="Opisz, w czym możemy pomóc"
              aria-invalid={messageError}
              className={
                messageError
                  ? "min-h-28 border-destructive ring-2 ring-destructive/20"
                  : "min-h-28"
              }
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
