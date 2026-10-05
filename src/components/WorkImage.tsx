import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  /** Shows the "open live site" arrow; the card itself is the link. */
  link?: string;
}

/** Intrinsic size of the committed screenshots, so the card reserves its space. */
const DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/work-typing-rush.webp": { width: 1200, height: 750 },
  "/images/work-gyanix-academy.webp": { width: 1200, height: 750 },
};

/**
 * The 400w/800w variants sit next to the original and follow the same naming,
 * so the srcset is derived instead of repeated in the data.
 */
function srcSetFor(image: string): string | undefined {
  if (!/\.(webp|png|jpe?g)$/.test(image)) return undefined;
  const stem = image.replace(/\.(webp|png|jpe?g)$/, "");
  const sizes = [400, 800]
    .map((w) => `${stem}-${w}w.webp ${w}w`)
    .join(", ");
  return `${sizes}, ${image} 1200w`;
}

/**
 * Preview media for a work card. The whole card is already the link, so this
 * renders a plain container - nesting an <a> here would be invalid HTML.
 */
const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  const size = DIMENSIONS[props.image];

  return (
    <div className="work-image">
      <div
        className="work-image-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        <img
          src={props.image}
          srcSet={srcSetFor(props.image)}
          // The card is capped at 460px on mobile and 600px on desktop, so the
          // browser never needs the 1200w original.
          sizes="(min-width: 1024px) 460px, 92vw"
          alt={props.alt}
          width={size?.width}
          height={size?.height}
          loading="lazy"
          decoding="async"
        />
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </div>
    </div>
  );
};

export default WorkImage;