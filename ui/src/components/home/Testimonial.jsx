import { IconBrandX } from "@tabler/icons-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Saneem Perinkadakkat",
    testimonial:
      "A simple tool to quickly get quality subtitles for any video. Loved the option to just put in a YouTube link and get it transcribed & translated!",
    profileLink: "https://in.linkedin.com/in/xaneem",
    picPath: "/profile/saneem.jpeg",
    credential: "Co-founder of ClusterDev which serves 100M+ users",
  },
  {
    name: "1LittleCoder",
    testimonial:
      "India is rich in its languages, art, and culture. Even though we have the best developers on the planet, until now, it's been hard to find a good subtitler that just works for Indian languages. But now it's possible with one click, thanks to Indic Subtitler. I'm fascinated by how beautifully it transcribes and handles the combination of Indian Languages + English alongside. The best part is that it's an open-source project!!!",
    profileLink: "https://twitter.com/1littlecoder",
    picPath: "/profile/1littlecoder.jpg",
    credential: " AI/ML educator",
  },
  {
    name: "Dr. Kavya Manohar",
    testimonial:
      "When it comes to subtitling your Indian languages videos or your Indian English videos, there was no proper means to do that.  What I love about indicsubtitler.in is that, it even allows you to edit any errors that might have crept in during transcription before you download the srt files. You can alternate between available models to find the best fit for your voice too. The tool is very handy with many such useful features.",
    profileLink: "https://www.linkedin.com/in/kavya-manohar/",
    picPath: "/profile/kavya.jpeg",
    credential: "Speech and Language Technologist",
  },
  {
    name: "Rejin Jose",
    credential: "Senior AI Engineer, IQVIA",
    testimonial:
      "I have tried IndicSubtitler. It is very useful and screen reader accessible. It is easy to navigate and generate the subtitles. Thanks to the team for keeping accessibility in mind while developing the product.",
    picPath: "/profile/rejin.jpeg",
    username: "@rejinjosek",
    profileLink:
      "https://www.linkedin.com/in/rejinjosek/?trk=blended-typeahead",
  },
  {
    publicProfile: true,
    name: "Akshay S Dinesh",
    credential:
      " Contributor at Swathanthra Malayalam Computing & Indic Project",
    testimonial:
      "I tested IndicSubtitler on a project I had earlier subtitled manually. There were some rough edges, such as missing lines and incorrect words, but these can be easily fixed using the built-in editor. It would have saved me hours of manual typing. The development of this project is also progressing at breakneck speed.",
    picPath: "/profile/akshay.jpg",
    platform: "twitter",
    username: "@asdofindia",
    reviewLink: "https://twitter.com/asdofindia/status/1765715027632312576",
    profileLink: "https://twitter.com/asdofindia",
  },
  {
    publicProfile: true,
    name: "Abhijith Neil Abraham",
    credential:
      "Engineer turned Entrepreneur, Maintainer of tableQA & pyvigate",
    testimonial:
      "This is an awesome project to watch out, there's so many usecases I already have at this point for using it.",
    picPath: "/profile/abhijith.jpg",
    platform: "twitter",
    username: "@abhijithneil",
    reviewLink: "https://twitter.com/abhijithneil/status/1765721685272277264",
    profileLink: "https://twitter.com/abhijithneil",
  },
  {
    publicProfile: true,
    name: "Omshivaprakash",
    credential: "Cofounder at Sanchaya and Sanchi Foundation",
    testimonial:
      "ಇಂಡಿಕ್ ಸಬ್‌ಟೈಟ್ಲರ್ - ಇದೀಗ ವಿಡಿಯೋಗಳಿಗೆ ಸಬ್ಟೈಟಲ್ ಮಾಡುವುದು ಸುಲಭ. ವಿಶಿಷ್ಟ ಚೇತನರೂ ಇದನ್ನು ಸುಲಭವಾಗಿ ಬಳಸುವಂತೆ ಮಾಡಿರುವುದು ಮತ್ತೂ ವಿಶೇಷ. ಈ ಮುಕ್ತ ತಂತ್ರಾಂಶವನ್ನು ಇಲ್ಲಿ ಬಳಸಿ ನೋಡಿ indicsubtitler.in ",
    picPath: "/profile/omshivaprakash.jpg",
    platform: "twitter",
    username: "@omshivaprakash",
    reviewLink: "https://twitter.com/omshivaprakash/status/1765721027156308259",
    profileLink: "https://twitter.com/omshivaprakash",
  },
  {
    name: "Kurian Thomas Pulimoottil",
    credential: "Software Engineer-2, ServiceNow",
    testimonial:
      "I see huge potential for Indic subtitler in the world of visual media. The approach taken by the team makes it feel very seamless to interact with. It makes me feel proud that we are getting closer to a world with no language barriers. I envision a future where the tool is hooked to an LLM which aligns the translations to better fit the context of the whole speech. It's awesome to see products working and trying to solve real hard problems.",
    profileLink: "https://www.linkedin.com/in/kurian-thomas-pulimoottil/",
    picPath: "/profile/kurian_thomas.jpeg",
  },
  {
    name: "Malik Ammar Faisal",
    testimonial:
      "IndicSubtitler has been helpful to me in generating captions for my YouTube videos. It also has the option to choose between different state-of-the-art (SOTA) models, which makes it more flexible and customizable.",
    profileLink: "https://twitter.com/ammarbinfaisal",
    username: "@ammarbinfaisal",
    picPath: "/profile/ammar.jpeg",
  },
];

const Testimonial = () => {
  const icons = {
    twitter: IconBrandX,
  };
  function PlatformIcon({ platform }) {
    const Icon = icons[platform];
    return <Icon size={20} />;
  }
  return (
    <section className="px-8 md:px-16 py-4 lg:py-10 my-28">
      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-8 p-4">
          Here's what people say about Indic Subtitler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:px-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md md:hover:bg-blue-100  drop-shadow-lg flex flex-col justify-between"
              style={{ minHeight: "30vh" }}
            >
              <section>
                <div className="flex md:flex-row flex-col items-center mb-5 gap-5">
                  <Image
                    width={70}
                    height={70}
                    src={testimonial.picPath}
                    alt={`Picture of ${testimonial.name}`}
                    className=" overflow-hidden rounded-full self-start "
                  />
                  <div className="flex items-center justify-between w-full gap-2 ">
                    <div className="flex flex-col">
                      <a
                        aria-label={`Link of ${testimonial.name}'s profile`}
                        href={testimonial.profileLink}
                        className="font-bold hover:underline"
                        target="_blank"
                      >
                        {testimonial.name}
                      </a>
                      <p className="text-sm text-gray-500">
                        {testimonial.credential}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{testimonial.testimonial}</p>
              </section>
              {testimonial.publicProfile && (
                <div className="flex items-end justify-end text-sm">
                  <a
                    aria-label="Link of tweet"
                    target="_blank"
                    href={testimonial.reviewLink}
                    className="flex gap-1"
                  >
                    <p className="">View on</p>
                    <PlatformIcon platform={testimonial.platform} height="32" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
