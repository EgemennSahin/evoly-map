import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LanguageButton from "./language-button";

export function NavBar() {
  const router = useRouter();
  const [countries, setCountries] = useState([
    { name: "usa", code: "en" },
    { name: "france", code: "fr" },
    { name: "germany", code: "de" },
  ]);

  // Change position of countries array to change order of languages
  function handleLanguageChange(index: number) {
    const selectedLanguage = countries[index];

    // Swap the selected language with the first language
    const newCountries = countries.map((country, i) => {
      if (i === 0) {
        return selectedLanguage;
      } else if (i === index) {
        return countries[0];
      } else {
        return country;
      }
    });
    setCountries(newCountries);

    // TODO: Change the language of the page
  }

  return (
    <nav className="bg-white fixed h-20 w-screen flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-32 text-xl shadow-lg z-50">
      <div className="flex gap-8 items-baseline">
        <Link
          href="/"
          className="text-slate-900 hover:text-teal-600 transition-colors font-bold tracking-tight font-serif"
        >
          evoly
        </Link>
        <div className="flex sm:hidden">
          <button
            onClick={() => {}}
            className="text-slate-500 hover:text-blue-700 font-extralight"
          >
            Browse
          </button>
        </div>
        <div key="pages" className="hidden sm:flex">
          {["energy", "contact"].map((page) => {
            let route = `/${page}`;

            // Changing styling according to current page
            let textStyle =
              router.pathname == route
                ? "text-blue-700 font-medium"
                : "text-slate-500 hover:text-blue-700 font-extralight";

            // All links direct to the home page
            return (
              <Link
                key={page}
                href="/"
                className={`${textStyle} capitalize pr-8`}
              >
                {page}
              </Link>
            );
          })}
        </div>
      </div>

      <div key="languages" className="flex gap-4">
        {countries.map((country, index) => (
          <button
            key={country.code}
            onClick={() => handleLanguageChange(index)}
            className="group"
          >
            <LanguageButton {...country} />
          </button>
        ))}
      </div>
    </nav>
  );
}
