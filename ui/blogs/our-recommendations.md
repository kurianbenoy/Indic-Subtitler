---
title: "Our model recommendation"
date: "2024-03-03"
author: "Kurain Benoy"
# authorImg: "jjthomas.png"
draft: true
description: "Our list of best practises for each languages, this will help you getting a better idea for model recommendation."
tags: [best-practises, model-selection, ASR]
---

## About Indic Subtitler

An open source subtitling platform 💻 for transcribing videos/audios in Indic languages and translating subtitles as well using ML models.
It is powered by models like SeamlessM4T, faster-whisper, WhisperX and Vegam-Whisper which support almost 12 Indic languages by default.

Since Indic Subtitler comes with this much models, this article is an effort to recommend our platform users to share, which
is the best models to use for your use case, in your own languages.

## About the models available in Indic Subtitler

#### 1. SeamlessM4T

Seamless is a family of AI models that enable more natural and authentic communication across languages. SeamlessM4T is a massive multilingual multimodal machine translation model supporting around 100 languages. SeamlessM4T serves as the foundation for SeamlessExpressive, a model that preserves elements of prosody and voice style across languages and SeamlessStreaming, a model supporting simultaneous translation and streaming ASR for around 100 languages. SeamlessExpressive and SeamlessStreaming are combined into Seamless, a unified model featuring multilinguality, real-time, and expressive translations.

#### 2. Faster-whisper(default)

faster-whisper is a reimplementation of OpenAI's Whisper model using CTranslate2, which is a fast inference engine for Transformer models. This implementation is up to 4 times faster than openai/whisper for the same accuracy while using less memory. The efficiency can be further improved with 8-bit quantization on both CPU and GPU.

#### 3. WhisperX

WhisperX provides fast automatic speech recognition (70x realtime with large-v2) with word-level timestamps and speaker diarization. The features provided by WhisperX are: Batched inference for 70x realtime transcription using whisper large-v2, faster-whisper backend, requires <8GB GPU memory for large-v2 with beam_size=5, Accurate word-level timestamps using wav2vec2 alignment, Multispeaker ASR using speaker diarization from pyannote-audio (speaker ID labels) and VAD preprocessing, reduces hallucination & batching with no WER degradation.

#### 4. Vegam-whisper

A faster-whisper fine-tuned version of Malayalam whisper, which performs decently in Malayalam. This is a conversion of `thennal/whisper-medium-ml` to the CTranslate2 model format.

## Our Model recommendations

#### For English audio

WhisperX > faster-whisper > SeamlessM4T

If you want better timestamp accuracy use SeamlessM4T

#### For Malayalam

Vegam-whisper = faster-whisper > SeamlessM4T

#### For Kannada

faster-whisper > SeamlessM4T

#### For Hindi

Faster-Whisper > WhisperX > SeamlessM4t

#### For Telugu
Faster-Whisper > WhisperX