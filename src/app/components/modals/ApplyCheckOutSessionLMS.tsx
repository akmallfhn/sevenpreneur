"use client";
import { FormEvent, useEffect, useState } from "react";
import InputSVP from "../fields/InputSVP";
import AppButton from "../buttons/AppButton";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { CheckOutSession } from "@/lib/actions";

interface ApplyCheckOutSessionLMSProps {
  learningId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccessCheckOut: () => void;
}

export default function ApplyCheckOutSessionLMS(
  props: ApplyCheckOutSessionLMSProps
) {
  const [checkOutCode, setCheckOutCode] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  // Blocked scroll behind
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  // Reset in every open modal
  useEffect(() => {
    if (props.isOpen) {
      setCheckOutCode("");
    }
  }, [props.isOpen]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setCheckOutCode(value);
  };

  const handleCheckOut = async (e: FormEvent) => {
    e.preventDefault();

    setCheckingOut(true);

    if (!checkOutCode.trim()) {
      toast.error("Please enter a checkout code!");
      setCheckingOut(false);
      return;
    }

    try {
      const checkOutSession = await CheckOutSession({
        learningId: props.learningId,
        checkOutCode: checkOutCode.trim(),
      });
      if (checkOutSession.code === "CREATED") {
        toast.success("You’ve successfully checked out!");
        props.onSuccessCheckOut();
        props.onClose();
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch {
      toast.error("Invalid check-out code");
    } finally {
      setCheckingOut(false);
    }
  };

  if (!props.isOpen) return null;

  return (
    <div
      className="modal-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]"
      onClick={props.onClose}
    >
      <div
        className="modal-container fixed flex bg-white max-w-[calc(100%-2rem)] p-6 w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md dark:bg-surface-black sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="apply-check-out-form flex flex-col w-full items-center gap-4"
          onSubmit={handleCheckOut}
        >
          <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col">
              <h2 className="w-full font-bodycopy font-bold">Check Out</h2>
              <p className="text-sm text-[#333333] font-bodycopy font-medium">
                To receive checkout code, please complete the ratings and
                feedback form first.
              </p>
            </div>
            <InputSVP
              inputId="check-out-code"
              inputType="text"
              inputPlaceholder="Enter check-out code here..."
              characterLength={32}
              value={checkOutCode}
              onInputChange={handleInputChange}
            />
          </div>
          <div className="cta flex w-full items-center gap-4 justify-end">
            <AppButton variant="semiDestructive" onClick={props.onClose}>
              Cancel
            </AppButton>
            <AppButton type="submit" disabled={checkingOut}>
              {checkingOut && <Loader2 className="animate-spin size-5" />}
              Submit
            </AppButton>
          </div>
        </form>
        <div
          className="absolute flex top-4 right-4 hover:cursor-pointer"
          onClick={props.onClose}
        >
          <X className="size-6" />
        </div>
      </div>
    </div>
  );
}
