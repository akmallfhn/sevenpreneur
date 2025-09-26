"use client";
import { useState } from "react";

export default function MostTest() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  const handleSendEmail = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`https://www.${domain}/api/mail`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setStatus("Email sent! Check Mailtrap inbox.");
      } else {
        setStatus("❌ Failed: " + data.error);
      }
    } catch (error) {
      setStatus("❌ Error: " + error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {loading ? "Sending..." : "Send Test Email"}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
