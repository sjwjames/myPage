import type { Metadata } from "next";
import evidenceSnapshot from "../../../public/data/ads-ai-offline-evidence-v1.json";
import AdsPlatformClient from "./AdsPlatformClient";
import OfflineMlLaboratory, { OfflineMlEvidence } from "./OfflineMlLaboratory";

export const metadata: Metadata = {
  title: "Ads AI Platform | Jianwei Shen",
  description:
    "An interactive, production-inspired advertising marketplace and AI serving dashboard.",
  openGraph: {
    title: "Ads AI Platform | Jianwei Shen",
    description:
      "Explore advertiser campaign controls, live text ads, and model-serving operations.",
    images: [],
  },
  twitter: {
    title: "Ads AI Platform | Jianwei Shen",
    description:
      "Explore advertiser campaign controls, live text ads, and model-serving operations.",
    images: [],
  },
};

export default function AdsPlatformPage() {
  return (
    <>
      <AdsPlatformClient />
      <OfflineMlLaboratory evidence={evidenceSnapshot as OfflineMlEvidence} />
    </>
  );
}
