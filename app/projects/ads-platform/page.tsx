import type { Metadata } from "next";
import AdsPlatformClient from "./AdsPlatformClient";

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
  return <AdsPlatformClient />;
}
