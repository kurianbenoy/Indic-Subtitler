import React from "react";

export default function Carousel() {
  const languages = [
    "Assamese",
    "Bengali",
    "English",
    "Gujarati",
    "Hindi",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Odia",
    "Punjabi",
    "Tamil",
    "Telgu",
    "Urdu",
  ];
  return (
    <div className="carousel carousel-center max-w-full p-4 space-x-4 bg-gray-100 rounded-box mt-12 border-4 border-primary">
      {languages.map((element, index) => {
        return (
          <div
            className="carousel-item  w-80 h-80 rounded-lg bg-white flex items-center justify-center"
            key={index}
          >
            <h2 className="text-4xl font-medium">{element}</h2>
          </div>
        );
      })}
    </div>
  );
}
