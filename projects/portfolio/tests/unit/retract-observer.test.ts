import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lifecycle = vi.hoisted(() => ({ effect: undefined as undefined | (() => void | (() => void)) }));
vi.mock("react", () => ({ useEffect: (effect: () => void | (() => void)) => { lifecycle.effect = effect; } }));
import { RetractObserver } from "@/components/portfolio/RetractObserver";

describe("retract visibility lifecycle", () => {
  let callback: IntersectionObserverCallback;
  let rows: HTMLElement[];
  let observer: { observe: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> };
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;
  let cleanup: void | (() => void);

  beforeEach(() => {
    lifecycle.effect = undefined;
    cleanup = undefined;
    frames = new Map();
    nextFrame = 0;
    rows = Array.from({ length: 2 }, () => {
      const attributes = new Set<string>();
      return {
        setAttribute: (name: string) => attributes.add(name),
        removeAttribute: (name: string) => attributes.delete(name),
        hasAttribute: (name: string) => attributes.has(name),
        getBoundingClientRect: vi.fn(() => { throw new Error("Visibility must not force synchronous geometry reads"); }),
      } as unknown as HTMLElement;
    });
    observer = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
    vi.stubGlobal("document", { getElementById: vi.fn(() => ({ querySelectorAll: () => rows })) });
    vi.stubGlobal("IntersectionObserver", class {
      constructor(listener: IntersectionObserverCallback, options: IntersectionObserverInit) {
        callback = listener;
        expect(options.threshold).toBe(0.5);
        return observer;
      }
    });
    vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => { frames.set(++nextFrame, frame); return nextFrame; });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  });

  afterEach(() => { cleanup?.(); vi.unstubAllGlobals(); });

  function mount() {
    RetractObserver({ id: "ledger" });
    cleanup = lifecycle.effect!();
  }

  function intersect(row: HTMLElement, intersectionRatio: number, isIntersecting = true) {
    const rect: DOMRectReadOnly = { x: 0, y: 0, width: 100, height: 100, top: 0, right: 100, bottom: 100, left: 0, toJSON: () => ({}) };
    callback([{ target: row, intersectionRatio, isIntersecting, time: 0,
      boundingClientRect: rect, intersectionRect: rect, rootBounds: null }], observer as unknown as IntersectionObserver);
  }

  function tick() {
    const pending = [...frames.entries()];
    frames.clear();
    pending.forEach(([, frame]) => frame(0));
  }

  it("keeps offscreen and less-than-half-visible rows armed, releasing a visible row after two frames", () => {
    mount();
    expect(observer.observe).toHaveBeenCalledTimes(2);
    expect(rows.every(row => row.hasAttribute("data-armed"))).toBe(true);
    intersect(rows[0], 0, false);
    intersect(rows[0], 0.49);
    expect(frames.size).toBe(0);
    intersect(rows[0], 0.5);
    expect(observer.unobserve).toHaveBeenCalledWith(rows[0]);
    tick();
    expect(rows[0].hasAttribute("data-armed")).toBe(true);
    tick();
    expect(rows[0].hasAttribute("data-armed")).toBe(false);
    expect(rows[1].hasAttribute("data-armed")).toBe(true);
    rows.forEach(row => expect(row.getBoundingClientRect).not.toHaveBeenCalled());
  });

  it("does no DOM or observer work when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    mount();
    expect(document.getElementById).not.toHaveBeenCalled();
    expect(observer.observe).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
    expect(rows.every(row => !row.hasAttribute("data-armed"))).toBe(true);
  });

  it("disconnects, cancels pending second frames and disarms every row on cleanup", () => {
    mount();
    intersect(rows[0], 1);
    tick();
    expect(frames.size).toBe(1);
    cleanup?.();
    cleanup = undefined;
    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(frames.size).toBe(0);
    expect(rows.every(row => !row.hasAttribute("data-armed"))).toBe(true);
  });
});
