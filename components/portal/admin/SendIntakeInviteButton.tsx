"use client";

import { useState, useTransition } from "react";
import { sendIntakeInvitation } from "@/app/actions/leads";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MailCheck, CheckCircle2 } from "lucide-react";

interface Props {
  leadId: string;
  inviteSentAt: Date | null;
  clientName: string;
}

export default function SendIntakeInviteButton({
  leadId,
  inviteSentAt,
  clientName,
}: Props) {
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await sendIntakeInvitation(leadId);
      if (result.success) {
        toast.success("Intake invitation sent successfully.");
        setDone(true);
      } else {
        toast.error(result.error ?? "Failed to send invitation.");
      }
    });
  }

  if (done || inviteSentAt) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[13px] text-emerald-700">
        <CheckCircle2 size={14} className="shrink-0" />
        <span>
          {done
            ? "Invitation sent."
            : `Invited on ${new Date(inviteSentAt!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}.`}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="ml-auto text-[11px] font-semibold underline underline-offset-2 hover:text-emerald-800">
              Resend
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resend invitation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will generate a new portal setup link and send it to{" "}
                <strong>{clientName}</strong>. The previous link may still be
                valid.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isPending}
                className="bg-navy hover:bg-navy-dark"
              >
                {isPending ? "Sending…" : "Resend"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full gap-2 bg-emerald-600 text-sm font-semibold hover:bg-emerald-700">
          <MailCheck size={15} />
          Proceed with intake
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send intake invitation?</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a secure client portal account for{" "}
            <strong>{clientName}</strong> (if they don't have one) and send them
            an email invitation to complete their structured intake form.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending ? "Sending…" : "Send invitation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
