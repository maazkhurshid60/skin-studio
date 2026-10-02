import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | Skin Studio Ithaca",
  description:
    "Skin Studio Ithaca's cancellation, rescheduling, and no-show policy. Please provide at least 48 hours' notice to change your appointment.",
};

export default function CancellationPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
