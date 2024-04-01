import Head from "next/head";
import React from "react";

const information = [
  {
    title: "1. Introduction",
    detail:
      "Indic-subtitler is an open source subtitling platform 💻 for transcribing and translating videos/audios in Indic languages. .The number of tools which are available in Indian languages to subitle audio and videos in Indian languages are almost none. Yet that shouldn't be the case, as now there are lot of open-source models supporting speech transcription in most of official Indian languages. This tool can be useful for subtitling audios and videos like Indian cinemas for Media Industry in general. With this tool now content-creators, can create youtube videos in their native language like Tamil and create captions in languages like English, Hindi, Malayalam etc. with our tool which will help them in reacing a diverse audience.",
    license: {
      name: "GNU General Public License v2.0",
      detail:
        "The GNU GPL is the most widely used free software license and has a strong copyleft requirement. When distributing derived works, the source code of the work must be made available under the same license. There are multiple variants of the GNU GPL, each with different requirements.",
    },
  },
  {
    title: "2. Models Used",
    detail:
      "Due to advent of new technologies like Meta's seamless M4T model and Whisper fine-tuned models, you can do speech transcription to transcribe audio's from source audio to source text. With this a Hindi audio can be transcribed to Hindi text for generating subtitles. Meta's seamless M4T model also supports translation which can take Hindi audio and generate subtitle in languages like English, French, Malayalam etc.",
  },
  {
    title: "2a. faster-whisper",
    detail:
      "faster-whisper is a reimplementation of OpenAI's Whisper model using CTranslate2, which is a fast inference engine for Transformer models.This implementation is up to 4 times faster than openai/whisper for the same accuracy while using less memory. The efficiency can be further improved with 8-bit quantization on both CPU and GPU.",
    license: {
      name: "MIT License",
      detail:
        "A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.",
    },
  },
  {
    title: "2b. SeamlessM4T",
    detail:
      "Seamless is a family of AI models that enable more natural and authentic communication across languages. SeamlessM4T is a massive multilingual multimodal machine translation model supporting around 100 languages. SeamlessM4T serves as foundation for SeamlessExpressive, a model that preserves elements of prosody and voice style across languages and SeamlessStreaming, a model supporting simultaneous translation and streaming ASR for around 100 languages. SeamlessExpressive and SeamlessStreaming are combined into Seamless, a unified model featuring multilinguality, real-time and expressive translations.",
    license: {
      name: "Attribution-NonCommercial 4.0 International",
      detail:
        "A license that allows for sharing and remixing of creative works while requiring attribution and prohibiting commercial use",
    },
  },
  {
    title: "2c. WhisperX",
    detail:
      "WhisperX provides fast automatic speech recognition (70x realtime with large-v2) with word-level timestamps and speaker diarization. The features provided by WhisperX are: Batched inference for 70x realtime transcription using whisper large-v2, faster-whisper backend, requires <8GB gpu memory for large-v2 with beam_size=5, Accurate word-level timestamps using wav2vec2 alignment, Multispeaker ASR using speaker diarization from pyannote-audio (speaker ID labels) and VAD preprocessing, reduces hallucination & batching with no WER degradation.",
    license: {
      name: "BSD 4-Clause Original or Old License",
      detail:
        "A permissive license similar to the BSD 3-Clause License, but with an advertising clause, that requires an acknowledgment of the original source in all advertising material.",
    },
  },
  {
    title: "2d. Vegam-whisper",
    detail:
      "A faster-whisper fine-tuned version of Malayalam whisper, which performs decently.",
    license: {
      name: "MIT License",
      detail:
        "A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. ",
    },
  },
];

export default function term() {
  return (
    <main className=" flex flex-col md:items-center mx-2 md:mx-0">
      <Head>
        <title>Terms & Licenses </title>
      </Head>
      <h1 className="font-serif md:w-[40%] text-3xl md:text-5xl mb-8">
        Indic Subtitler Terms & Licenses
      </h1>
      {information.map((element, index) => (
        <div className="md:w-[40%] mb-12 " key={index}>
          <h2 className="mb-2 font-semibold">{element.title}</h2>
          <p className="">{element.detail}</p>
          {element.license && (
            <>
              <h3 className="mt-2 font-medium">
                License: {element.license.name}
              </h3>
              <p className="">{element.license.detail}</p>
            </>
          )}
        </div>
      ))}
    </main>
  );
}
