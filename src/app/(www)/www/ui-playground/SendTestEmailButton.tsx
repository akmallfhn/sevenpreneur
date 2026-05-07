"use client";
import AppButton from "@/components/buttons/AppButton";
import { SendTestInvoiceEmail } from "@/lib/actions";
import { useState } from "react";

export default function SendTestEmailButton() {
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSendInvoice() {
    if (!to) return;
    setStatus("pending");
    setErrorMsg(null);
    try {
      await SendTestInvoiceEmail(to);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send email.",
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-6 border border-dashed border-gray-300 rounded-xl max-w-sm mx-auto">
      <p className="text-sm font-semibold text-gray-700">Send Test Email</p>

      <input
        type="email"
        placeholder="recipient@email.com"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <AppButton
        variant="primary"
        onClick={handleSendInvoice}
        disabled={status === "pending" || !to}
      >
        {status === "pending" ? "Sending..." : "Send Invoice Email"}
      </AppButton>

      {status === "success" && (
        <p className="text-xs text-green-600 font-medium">Invoice email sent!</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 font-medium">
          {errorMsg ?? "Failed to send email."}
        </p>
      )}
    </div>
  );
}
