"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "../actions/contact";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import AnimatedGradientText from "./AnimatedGradientText";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [isFormValid, setIsFormValid] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFormChange = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    setIsFormValid(form.checkValidity());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const response = await submitContactForm(formData);
      setResult(response);

      if (response.success) {
        form.reset();
        setIsFormValid(false);
      }
    });
  };

  return (
    <footer className="bg-primary text-white py-16 px-6 mt-84">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column - Header Text */}
          <div>
            <p className="text-5xl text-secondary tracking-[0.015em] font-hardbop">
              voor winkeleigenaren:
            </p>
            <h2 className="text-5xl md:text-7xl font-black font-hardbop leading-[1.1] mb-6">
              vraag vandaag nog een<br />
              <AnimatedGradientText>gratis</AnimatedGradientText> proefpakket
            </h2>
            <p className="text-lg leading-relaxed">
              Laat je contactgegevens achter en ontvang een gratis proefpakket om zelf de kwaliteit van Lanalicious te ervaren.
            </p>
          </div>

          {/* Right Column - Form */}
          <div>
            <form onSubmit={handleSubmit} onChange={handleFormChange} className="space-y-4">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="voornaam"
                  name="voornaam"
                  type="text"
                  required
                  disabled={isPending}
                />
                <FormInput
                  label="achternaam"
                  name="achternaam"
                  type="text"
                  required
                  disabled={isPending}
                />
              </div>

              {/* Email Field */}
              <FormInput
                label="email"
                name="email"
                type="email"
                placeholder="iemand@voorbeeld.com"
                required
                disabled={isPending}
              />

              {/* Message Field */}
              <FormTextarea
                label="bericht"
                name="bericht"
                rows={5}
                required
                disabled={isPending}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || !isFormValid}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Verzenden..." : "Verstuur Bericht"}
              </button>

              {/* Result Message */}
              {result && (
                <div
                  className={`p-4 rounded-lg text-center font-medium ${
                    result.success
                      ? "bg-green-500/20 text-green-100 border border-green-400"
                      : "bg-red-500/20 text-red-100 border border-red-400"
                  }`}
                >
                  {result.message}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <h3 className="text-lg font-bold mb-4">Contactinformatie</h3>
          <div className="flex flex-col space-y-2 text-md">
            <a href="tel:+31065117098" className="hover:text-pink-300 transition-colors">
              +31 (0)6 51170984
            </a>
            <a href="mailto:info@lanalicious.nl" className="hover:text-pink-300 transition-colors">
              info@lanalicious.nl
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

