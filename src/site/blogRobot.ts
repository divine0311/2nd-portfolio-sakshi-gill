/**
 * The robotic 3D character from the home page, running inside the blog.
 *
 * Same encrypted model, same HDR environment, same idle/intro animations
 * (src/components/Character/utils). Only the GSAP scroll timelines are left
 * behind, because those are bound to the home page sections.
 *
 * The scene is built once and then re-parented into whichever hero slot the
 * current view rendered, so filtering the listing or reading an article never
 * re-downloads the model. Phones skip it entirely - the hero is a single
 * column there and the model is 1.5MB.
 */
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, RGBELoader } from "three-stdlib";
import { decryptFile } from "../components/Character/utils/decrypt";
import setAnimations from "../components/Character/utils/animationUtils";
import { handleMouseMove, handleHeadRotation } from "../components/Character/utils/mouseUtils";

const MODEL_URL = "/models/character.enc";
const MODEL_KEY = "Character3D#@";
const HOST_ID = "blog-robot";

let booted = false;

/**
 * True on phones, tablets and anything that has asked to save data or reduce
 * motion. The model is 1.5MB and the scene animates continuously, so those
 * devices skip WebGL entirely.
 */
function shouldSkipWebGL(): boolean {
  if (!window.matchMedia("(min-width: 1024px)").matches) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  if (connection?.saveData) return true;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (cores <= 4 || memory <= 4) return true;

  return false;
}

/**
 * The fallback is pure CSS (see `.blog-robot.is-static` in blog.css): an accent
 * glow instead of a WebGL canvas. No model download, no render loop, no image
 * request - so it costs nothing on a low-end device.
 */
function showStaticFallback(host: HTMLElement): void {
  host.replaceChildren();
  host.classList.add("is-static");
}

/** Mirrors Character/utils/lighting.ts, minus the GSAP tween the blog has no use for. */
function setBlogLighting(scene: THREE.Scene): void {
  const key = new THREE.DirectionalLight(0xc7a9ff, 1);
  key.position.set(-0.47, -0.32, -1);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8f6bff, 0.4);
  fill.position.set(0.7, 0.5, 1);
  scene.add(fill);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.64;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });
}

export function mountRobot(): void {
  if (booted) return;
  booted = true;

  const host = document.getElementById(HOST_ID) as HTMLDivElement | null;
  if (!host) return;

  if (shouldSkipWebGL()) {
    showStaticFallback(host);
    return;
  }

  // WebGL can still be missing entirely (blocked, or a driver hiccup).
  try {
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) {
      showStaticFallback(host);
      return;
    }
  } catch {
    showStaticFallback(host);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(14.5, 1, 0.1, 1000);
  camera.position.set(0, 13.1, 24.7);
  camera.zoom = 1.05;
  camera.updateProjectionMatrix();

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  /**
   * `setSize(w, h, false)` leaves the CSS size alone, so the canvas is laid out
   * by `.blog-robot canvas { width: 100%; height: 100% }` and can never be
   * wider than its slot. Passing the default third argument writes an inline
   * pixel width on the canvas, which is what used to push the whole document
   * ~800px sideways on desktop.
   */
  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();

  // The host is moved between hero slots and the window can be resized, so the
  // box is re-measured whenever it changes rather than only on mount.
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(host);
  }

  setBlogLighting(scene);

  const clock = new THREE.Clock();
  const mouse = { x: 0, y: 0 };
  const interpolation = { x: 0.1, y: 0.2 };
  let mixer: THREE.AnimationMixer | undefined;
  let headBone: THREE.Object3D | null = null;
  let frame = 0;
  let onScreen = true;
  let tabVisible = !document.hidden;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!onScreen || !tabVisible) return;
    if (mixer) mixer.update(clock.getDelta());
    if (headBone) {
      handleHeadRotation(
        headBone,
        mouse.x,
        mouse.y,
        interpolation.x,
        interpolation.y,
        THREE.MathUtils.lerp,
      );
    }
    renderer.render(scene, camera);
  };

  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  decryptFile(MODEL_URL, MODEL_KEY)
    .then((encrypted) => {
      const url = URL.createObjectURL(new Blob([encrypted]));
      loader.load(
        url,
        async (gltf) => {
          URL.revokeObjectURL(url);
          const character = gltf.scene;
          await renderer.compileAsync(character, camera, scene);
          character.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          ["footL", "footR"].forEach((bone) => {
            const foot = character.getObjectByName(bone);
            if (foot) foot.position.y = 3.36;
          });

          const animations = setAnimations(gltf);
          animations.hover(gltf, host);
          mixer = animations.mixer;
          draco.dispose();

          host.classList.add("is-ready");
          setTimeout(() => animations.startIntro(), 350);
        },
        undefined,
        (error) => {
          console.error("Blog robot: model failed to load", error);
          host.classList.add("is-off");
        },
      );
    })
    .catch((error) => {
      console.error("Blog robot: model could not be decrypted", error);
      host.classList.add("is-off");
    });

  tick();

  document.addEventListener(
    "mousemove",
    (event) =>
      handleMouseMove(event, (x, y) => {
        mouse.x = x;
        mouse.y = y;
      }),
    { passive: true },
  );
  window.addEventListener("resize", resize);

  // The hero is above the fold, so stop burning frames once it is gone.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    }).observe(host);
  }
  document.addEventListener("visibilitychange", () => {
    tabVisible = !document.hidden;
  });

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      draco.dispose();
    },
    { once: true },
  );
}