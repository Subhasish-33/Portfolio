import { PortfolioShowcase } from "@/components/portfolio-showcase";
import { personalDetails, projects } from "@/lib/portfolio-data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalDetails.name,
  jobTitle: personalDetails.title,
  email: personalDetails.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhubaneswar",
    addressRegion: "Odisha",
    addressCountry: "India",
  },
  sameAs: [
    personalDetails.githubUrl,
    personalDetails.linkedinUrl,
    personalDetails.xUrl,
    personalDetails.leetcodeUrl,
    personalDetails.instagramUrl,
  ],
  alumniOf: "C.V. Raman Global University",
  knowsAbout: personalDetails.specializations,
  worksFor: {
    "@type": "Organization",
    name: "IIT Guwahati credit-linked Data Science & Machine Learning Program",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    name: "Subhasish Kumar Sahu Portfolio",
  },
  hasPart: projects.map((project) => ({
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioShowcase />
    </>
  );
}