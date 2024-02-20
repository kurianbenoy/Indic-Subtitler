from faster_whisper import WhisperModel

model_size = "large-v3"

# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")

segments, info = model.transcribe(
    "Bishop Thomas Tharayil speaks about Dr Shashi Tharoor at Lourdes Forane Church Thiruvananthapuram.mp4",
    beam_size=5,
    language="en",
)

print(
    "Detected language '%s' with probability %f"
    % (info.language, info.language_probability)
)

for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
