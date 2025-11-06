"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TechIcons, SocialIcons } from "@/components/comp/tech-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { toast } from "sonner";
import { InfiniteTechSlider } from "@/components/ui/infinite-tech-slider";
import { LiveActivity } from "@/components/comp/live-activity";
import { UptimeTimer } from "@/components/comp/uptime-timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!", {
          description:
            "Thank you for reaching out. I'll get back to you within 24hours.",
        });
        // Reset form
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Handle rate limit error specifically
        if (response.status === 429) {
          const resetDate = result.reset
            ? new Date(result.reset).toLocaleTimeString()
            : "soon";
          toast.error("Too many requests", {
            description: `You've reached the limit of ${
              result.limit || 5
            } messages per hour. Please try again at ${resetDate}.`,
          });
        } else {
          toast.error("Failed to send message", {
            description: result.error || "Please try again later.",
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again later or contact me directly via email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "work", "gallery", "activity", "connect", "contact"].map(
            (section) => (
              <button
                key={section}
                onClick={() =>
                  document
                    .getElementById(section)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className={`w-2 h-8 rounded-full transition-all duration-500 ${
                  activeSection === section
                    ? "bg-foreground"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Navigate to ${section}`}
              />
            )
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-border/50 flex-shrink-0">
                    <Image
                      src="/bryan.jpg"
                      alt="Bryan Palay"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="space-y-3 sm:space-y-2">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight">
                      Bryan
                      <br />
                      <span className="text-muted-foreground">Palay</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Full Stack Developer building modern web applications with
                  <span className="text-foreground"> TypeScript</span>,
                  <span className="text-foreground"> React</span>, and
                  <span className="text-foreground"> Next.js</span>. Still
                  Learning and Making it Better!
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for work -
                    <span className="text-foreground">Philippines</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">
                  CURRENTLY
                </div>
                <div className="space-y-2">
                  <div className="text-foreground">Full Stack Developer</div>
                  <div className="text-muted-foreground">
                    Building & Learning
                  </div>
                  <div className="text-xs text-muted-foreground">
                    2025 — Present
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">
                  FOCUS
                </div>
                <InfiniteTechSlider
                  technologies={[
                    {
                      name: "Next.js",
                      icon: TechIcons.NextJS,
                      color: "currentColor",
                    },
                    {
                      name: "React",
                      icon: TechIcons.React,
                      color: "text-[#61DAFB]",
                    },
                    {
                      name: "TypeScript",
                      icon: TechIcons.TypeScript,
                      color: "text-[#3178C6]",
                    },
                    {
                      name: "JavaScript",
                      icon: TechIcons.JavaScript,
                      color: "text-[#F7DF1E]",
                    },
                    {
                      name: "Tailwind CSS",
                      icon: TechIcons.TailwindCSS,
                      color: "text-[#06B6D4]",
                    },
                    {
                      name: "Shadcn UI",
                      icon: TechIcons.Shadcn,
                      color: "text-foreground",
                    },
                    {
                      name: "Prisma",
                      icon: TechIcons.Prisma,
                      color: "text-[#2D3748]",
                    },
                    {
                      name: "PostgreSQL",
                      icon: TechIcons.PostgreSQL,
                      color: "text-[#336791]",
                    },
                    {
                      name: "MongoDB",
                      icon: TechIcons.MongoDB,
                      color: "text-[#47A248]",
                    },
                    {
                      name: "Express.js",
                      icon: TechIcons.Express,
                      color: "text-gray-400",
                    },
                    {
                      name: "Better Auth",
                      icon: TechIcons.BetterAuth,
                      color: "text-yellow-500",
                    },
                    {
                      name: "HTML5",
                      icon: TechIcons.HTML5,
                      color: "text-[#E34F26]",
                    },
                    {
                      name: "Git",
                      icon: TechIcons.Git,
                      color: "text-[#E34F26]",
                    },
                    {
                      name: "NodeJs",
                      icon: TechIcons.Node,
                      color: "text-[#0DDB24]",
                    },
                  ]}
                  speed={20}
                  direction="left"
                  className="py-2"
                />
              </div>
            </div>
          </div>
        </header>

        <section
          id="work"
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">
                Featured Projects
              </h2>
              <div className="text-sm text-muted-foreground font-mono">
                2025 — Present
              </div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2025",
                  role: "Tech Parts",
                  company: "Personal Project",
                  description:
                    "A modern Inventory Management System built with Next.js, Prisma, PostgreSQL, Better Auth, and Shadcn UI. It provides a secure, scalable, and visually polished platform for managing products, categories, and stock.",
                  tech: [
                    { name: "Next.js", icon: TechIcons.NextJS },
                    { name: "Shadcn UI", icon: TechIcons.Shadcn },
                    { name: "Better Auth", icon: TechIcons.BetterAuth },
                    { name: "Prisma", icon: TechIcons.Prisma },
                    { name: "PostgreSQL", icon: TechIcons.PostgreSQL },
                  ],
                  liveUrl: "https://techparts-pi.vercel.app/",
                  githubUrl:
                    "https://github.com/bry-ly/tech-parts-inventory-system",
                },
                {
                  year: "2025",
                  role: "Dental U-Care",
                  company: "Personal Project",
                  description:
                    "Dental Booking System for managing appointments and patient care with a modern, intuitive interface.",
                  tech: [
                    { name: "Next.js", icon: TechIcons.NextJS },
                    { name: "Shadcn UI", icon: TechIcons.Shadcn },
                    { name: "Better Auth", icon: TechIcons.BetterAuth },
                    { name: "Prisma", icon: TechIcons.Prisma },
                    { name: "MongoDB", icon: TechIcons.MongoDB },
                  ],
                  liveUrl: "https://dental-u-care.vercel.app/",
                  githubUrl: "https://github.com/bry-ly/dental-u-care",
                },
                {
                  year: "2025",
                  role: "Amethyst Inn",
                  company: "Personal Project",
                  description:
                    "A guest house booking platform offering cozy rooms and warm hospitality. Perfect for travelers seeking comfort and relaxation with a clean, responsive interface.",
                  tech: [
                    { name: "Next.js", icon: TechIcons.NextJS },
                    { name: "Shadcn UI", icon: TechIcons.Shadcn },
                    { name: "MongoDB", icon: TechIcons.MongoDB },
                    { name: "Express JS", icon: TechIcons.Express },
                  ],
                  liveUrl: "https://amethystinn.vercel.app/",
                  githubUrl: "https://github.com/bry-ly/amethystinn",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-2">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium ">
                        {job.role}
                      </h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                      {job.description}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      {job.liveUrl && (
                        <Link
                          href={job.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-300"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Live Demo
                        </Link>
                      )}
                      {job.githubUrl && (
                        <Link
                          href={job.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:border-muted-foreground/50 hover:bg-accent transition-all duration-300"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-3 mt-2 lg:mt-0 overflow-hidden">
                    <div className="text-xs text-muted-foreground font-mono mb-2">
                      TECH USED
                    </div>
                    <InfiniteTechSlider
                      technologies={job.tech.map((tech) => {
                        const getIconColor = (name: string) => {
                          switch (name) {
                            case "Next.js":
                              return "currentColor";
                            case "Prisma":
                              return "text-[#2D3748]";
                            case "PostgreSQL":
                              return "text-[#336791]";
                            case "Shadcn UI":
                              return "text-foreground";
                            case "Better Auth":
                              return "text-yellow-500";
                            case "MongoDB":
                              return "text-[#47A248]";
                            case "Express JS":
                              return "text-gray-400";
                            default:
                              return "text-muted-foreground";
                          }
                        };

                        return {
                          name: tech.name,
                          icon: tech.icon,
                          color: getIconColor(tech.name),
                        };
                      })}
                      speed={15}
                      direction="left"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="gallery"
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">
                Project Gallery
              </h2>
              <div className="text-sm text-muted-foreground font-mono">
                FEATURED WORK
              </div>
            </div>

            <div className="grid gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Tech Parts",
                  image: "/projects/techparts.png",
                  url: "https://techparts-pi.vercel.app/",
                },
                {
                  title: "Amethyst Inn",
                  image: "/projects/amethsyt.png",
                  url: "https://amethystinn.vercel.app/",
                },
                {
                  title: "Dental U-Care",
                  image: "/projects/dental.png",
                  url: "https://dental-u-care.vercel.app/",
                },
              ].map((project, index) => (
                <Link
                  key={index}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-500"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-medium flex items-center gap-2 group-hover:text-muted-foreground transition-colors duration-300">
                      {project.title}
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="activity"
          ref={(el) => {
            sectionsRef.current[3] = el;
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <LiveActivity />
        </section>

        <section
          id="connect"
          ref={(el) => {
            sectionsRef.current[4] = el;
          }}
          className="py-20 sm:py-32 opacity-0"
        >
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Open to new opportunities and collaborations. Let's connect
                  and build something amazing together!
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:bryanpalay119@gmail.com"
                    className="group inline-flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300 p-4 border border-border rounded-lg hover:border-muted-foreground/50"
                  >
                    <svg
                      className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-base sm:text-lg font-medium">
                      bryanpalay119@gmail.com
                    </span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">
                ELSEWHERE
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 w-full lg:w-lg">
                {[
                  {
                    name: "GitHub",
                    handle: "@bry-ly",
                    url: "https://github.com/bry-ly",
                    icon: TechIcons.GitHub,
                  },
                  {
                    name: "Facebook",
                    handle: "Bryan Palay",
                    url: "https://facebook.com/bryan.palay.35",
                    icon: SocialIcons.Facebook,
                    color: "text-[#1877F2]",
                  },
                  {
                    name: "Instagram",
                    handle: "@aokinyccc",
                    url: "https://instagram.com/aokinyccc",
                    icon: SocialIcons.Instagram,
                    color: "text-[#E4405F]",
                  },
                  {
                    name: "X (Twitter)",
                    handle: "@bry_ly28",
                    url: "https://x.com/bry_ly28",
                    icon: SocialIcons.Twitter,
                  },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 border border-border rounded-xl hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-accent/50 group-hover:bg-accent transition-colors duration-300">
                        <social.icon
                          className={`w-6 h-6 group-hover:scale-110 transition-transform duration-300 ${social.color}`}
                        />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300 font-medium text-base">
                          {social.name}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {social.handle}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Contact Form Section */}
        <section
          id="contact"
          ref={(el) => {
            sectionsRef.current[5] = el;
          }}
          className="py-20 sm:py-32 opacity-0"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center gap-10 md:gap-12">
              {/* Section Title */}
              <div className="mx-auto flex max-w-xl flex-col items-center text-center space-y-4">
                <h2
                  id="contact-heading"
                  className="text-3xl sm:text-4xl font-light"
                >
                  Get in touch
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Have a project in mind or want to collaborate? Feel free to
                  reach out! I typically respond within 24 hours.
                </p>
              </div>
              {/* Contact Form */}
              <form
                className="flex w-full flex-col"
                onSubmit={handleSubmit}
                aria-label="Contact form"
              >
                <FieldSet>
                  <FieldGroup>
                    {/* Name Input */}
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        disabled={isSubmitting}
                      />
                    </Field>

                    {/* Email Input */}
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        placeholder="your.email@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        disabled={isSubmitting}
                      />
                    </Field>

                    {/* Message Textarea */}
                    <Field>
                      <FieldLabel htmlFor="message">Message</FieldLabel>
                      <Textarea
                        id="message"
                        placeholder="Tell me about your project or just say hi..."
                        className="min-h-[120px]"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        disabled={isSubmitting}
                      />
                    </Field>
                    {/* Submit Button */}
                    <Field>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send message"}
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </form>
            </div>
          </div>
        </section>
        <footer className="py-10 sm:py-10 border-t border-border">
          <TooltipProvider>
            <div className="space-y-2">
              {/* Uptime Timer Section */}
              <div className="flex justify-center pb-6 border-b border-border/50">
                <UptimeTimer />
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    © 2025 Bryan Palay. All rights reserved.
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Built with </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://nextjs.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <TechIcons.NextJS className="w-3.5 h-3.5 text-sky-400" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Next.js</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://ui.shadcn.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <TechIcons.Shadcn className="w-3.5 h-3.5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Shadcn UI</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://resend.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <TechIcons.Resend className="w-3.5 h-3.5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Resend</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://tailwindcss.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <TechIcons.TailwindCSS className="w-3.5 h-3.5 text-sky-400" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tailwind CSS</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://www.typescriptlang.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <TechIcons.TypeScript className="w-3.5 h-3.5 text-sky-600" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>TypeScript</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="https://reactjs.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <TechIcons.React className="w-3.5 h-3.5 text-sky-500" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>React</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Link
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <span>Deployed on</span>
                    <TechIcons.Vercel className="w-4 h-4" />
                    <span className="font-medium">Vercel</span>
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300"
                    aria-label="Toggle theme"
                  >
                    {isDark ? (
                      <svg
                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>

                  <button className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  );
}
