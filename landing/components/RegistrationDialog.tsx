"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Loader2, MessageCircle, SendHorizontal } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studyPrograms, contactInfo } from "@/data/unibaData";
import { pushEvent, pushEventOncePerSession } from "@/lib/analytics";

interface RegistrationDialogProps {
  trigger: ReactNode;
  defaultProgramId?: string;
}

/**
 * Lead-capture modal. There is no backend/CRM in this build, so submission
 * hands the lead straight to WhatsApp admissions with a prefilled message —
 * an honest, working substitute rather than a fake "submitted" state.
 */
export function RegistrationDialog({ trigger, defaultProgramId }: RegistrationDialogProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [programId, setProgramId] = useState(defaultProgramId ?? "");
  const [school, setSchool] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const program = studyPrograms.find((p) => p.id === programId);
    const message = [
      "Assalamu'alaikum, saya ingin mendaftar PMB UNIBA Surakarta.",
      `Nama: ${name}`,
      `No. WhatsApp: ${phone}`,
      program ? `Program Studi: ${program.name}` : null,
      school ? `Asal Sekolah: ${school}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;

    // Primary lead signal. Not deduplicated: a second submission is a genuinely
    // separate lead (different prodi, corrected phone number), unlike tapping two
    // WhatsApp buttons. No form field values are sent — only which prodi was
    // chosen, so nothing personally identifying reaches Google.
    pushEvent("form_submit", {
      form_name: "registration_dialog",
      program_id: programId || null,
      program_name: program?.name ?? null,
    });

    // This submit also opens WhatsApp, but via window.open rather than an anchor,
    // so AnalyticsProvider's delegated listener cannot see it. Report it here.
    // The per-session dedup means this never double-counts against a WA button.
    pushEventOncePerSession("wa_click", {
      wa_source: "registration_form",
      page_path: window.location.pathname,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setIsSubmitting(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Daftar Sekarang</DialogTitle>
          <DialogDescription>
            Gratis biaya formulir. Lengkapi data singkat berikut — tim admisi PMB akan
            melanjutkan proses via WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-name`}>Nama Lengkap</Label>
            <input
              id={`${formId}-name`}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama sesuai ijazah"
              className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-phone`}>Nomor WhatsApp</Label>
            <input
              id={`${formId}-phone`}
              required
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-program`}>Program Studi Pilihan</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger id={`${formId}-program`} className="w-full">
                <SelectValue placeholder="Pilih program studi" />
              </SelectTrigger>
              <SelectContent>
                {studyPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${formId}-school`}>Asal Sekolah (opsional)</Label>
            <input
              id={`${formId}-school`}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="SMA/SMK/MA ..."
              className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-11 gap-2 bg-uniba-navy text-white hover:bg-uniba-navy/90"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MessageCircle className="size-4" />
            )}
            Lanjutkan via WhatsApp
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
