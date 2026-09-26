# NeuroUX — Neuroscience-Driven UX Analyzer

Predict how a video, audio clip, or piece of text will activate a viewer's brain — and turn that into UX scores you can act on.

https://github.com/Arrnnnaav/neuroux/raw/main/docs/demo.mp4

NeuroUX takes any media file, runs it through Meta's TRIBE v2 (a foundation model trained to predict fMRI BOLD signal from naturalistic stimuli), maps the predicted cortical activation to 12 named brain regions via the Destrieux atlas, and scores the result on six interpretable UX dimensions plus an overall NeuroUX score and a virality predictor.

```
Video / Audio / Text ──► TRIBE v2 ──► (n_segments × 20,484 vertices)
                                        │
                                        ▼ aggregate (mean + std fingerprint)
                                  Destrieux atlas ROI averaging
                                        │
                                        ▼
                          12 brain region activations [0..1]
                                        │
                                        ▼
                  attention · engagement · cognitive load
                  emotional valence · memorability · addiction · overall
                                        │
                                        ▼
              Next.js 3D brain viewer · radar · timeline · A/B compare
```

## What it does

- **Single analysis** — drop a video, audio, or text file; get back a 3D brain colored by activation, a radar chart of UX metrics, and a virality prediction.
- **A/B compare** — upload two files side-by-side; see which variant wins on each metric and why (which regions diverge).
- **Video timeline** — per-segment attention/engagement/valence over the duration of a clip.
- **History** — every analysis persists, so you can come back and compare against past runs.

## Why this exists

Most "AI for marketing" tools bolt sentiment classifiers onto an LLM and call it neuroscience. NeuroUX uses an actual brain-prediction model (TRIBE v2 was trained on people watching movies in an fMRI scanner) and grounds its scores in real anatomy via the Destrieux 2009 atlas. The UX layer on top is a transparent set of weighted region formulas — you can read the code and see exactly why a video scored what it did.

## Stack

**Backend** — Python 3.12, FastAPI, SQLAlchemy async (SQLite), Server-Sent Events for live progress, PyTorch + transformers + bitsandbytes, nilearn for the atlas, librosa / OpenCV / ffmpeg for media decoding.

**Frontend** — Next.js 16 (App Router, Turbopack), React 19, React Three Fiber + drei (3D brain), Recharts (radar / timeline), Zustand (state), Tailwind 4, react-dropzone.

**Model** — TRIBE v2 (Meta AI, fMRI-supervised foundation model) wrapping LLaMA 3.2-3B (text), V-JEPA2 ViT-G (video), Wav2Vec-BERT 2 (audio).

## The hard parts

The interesting engineering wasn't gluing components together — it was getting a 1B-parameter brain-prediction stack to run on a 4 GB laptop GPU.

### 1. Text inference: 36 hours → 1 minute

LLaMA 3.2-3B in fp16 needs ~6 GB VRAM (won't fit on a 3050) and on CPU each word takes ~6 minutes. A 350-word paragraph would have taken **36 hours**. Solution: monkey-patched TRIBE's text extractor to load LLaMA in 4-bit NF4 with bitsandbytes (~2 GB VRAM), running ~50× faster than CPU. Same paragraph now finishes in ~70 seconds.

### 2. Video inference: 50 minutes → ~80 seconds

V-JEPA2 ViT-G (the visual encoder) is ~1B params, fp16 weights ~2.6 GB. Default install runs it on CPU at ~7 min per 16-frame chunk. Patched the loader to move the model to GPU in fp16 with `device_map={"":0}` and a forward-wrapper that auto-relocates input tensors and dtype-casts. A 3-second clip now encodes in ~10 seconds.

### 3. The "everything ties" bug

The first version of the scoring layer would return near-identical scores for emotionally opposite inputs (rage audio scored the same as sad audio). Root cause: the model's per-vertex output was being globally z-scored across all 20,484 vertices before ROI averaging, which threw away absolute magnitude and left only relative-shape information that two speech clips share. Fix: replaced the global z-score with a per-vertex (mean + 0.7·std) fingerprint, then z-scored across the **12 ROIs** (not the 20,484 vertices) before sigmoid. Two emotionally distinct audios now produce visibly different region rankings and different scores.

### 4. Score formulas that actually discriminate

The original engagement formula weighted amygdala equally with motor cortex. Problem: amygdala fires for any negative emotion (rage **and** sadness), so it didn't help distinguish them. Reweighted around motor cortex (clean arousal proxy) and added an explicit gain stretch around the 0.5 baseline so 2-point region differences become 4-point score differences in the final UI.

## Run it

```bash
# Backend
cd backend
pip install -r requirements.txt
pip install git+https://github.com/facebookresearch/tribev2.git
cp .env.example .env
# add your HUGGINGFACE_TOKEN (LLaMA 3.2 is gated)
uvicorn app.main:app --port 8000

# Frontend
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Without TRIBE weights, the backend automatically falls back to a deterministic stub (SHA-256-of-file → seeded RNG with realistic per-modality region biases) so the rest of the pipeline is always testable.

## Repo layout

```
backend/
  app/
    api/v1/                   FastAPI routes (analyze, compare, health, history…)
    pipeline/
      model/                  TRIBE v2 wrapper + GPU-quantization patches
      cognitive/              Destrieux mapper · UX scorer
    schemas/                  Pydantic request/response models
    db/                       SQLAlchemy async models
    services/                 Analysis + history orchestration
frontend/
  app/                        Next.js routes (/analyze, /history, /compare)
  components/
    brain/                    3D brain viewer (R3F)
    metrics/                  Score cards · radar · ring
    insights/                 Virality predictor
    upload/                   DualDropZone with SSE progress
  lib/                        API client · SSE client
  hooks/                      Single + dual analysis hooks
  store/                      Zustand stores
model_weights/                TRIBE v2 weights (download separately)
```

## Roadmap

- Wav2Vec-BERT GPU acceleration (audio is currently the slowest modality on CPU)
- Property-based tests on the scorer/mapper to lock in current behavior
- Pin `transformers` and `tribev2` versions; the GPU patches are version-sensitive
- Hosted deployment (currently runs on a single laptop GPU)

## Credits

- **TRIBE v2** — Meta AI / facebookresearch — [github.com/facebookresearch/tribev2](https://github.com/facebookresearch/tribev2)
- **Destrieux atlas** — Destrieux et al. 2009, distributed via nilearn
- **fsaverage5** surface mesh — FreeSurfer
