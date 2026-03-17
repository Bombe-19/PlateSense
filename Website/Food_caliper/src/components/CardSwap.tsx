import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  HTMLAttributes
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card ${customClass ?? ""} ${className ?? ""}`.trim()}
    />
  )
);
Card.displayName = "Card";

interface SlotPosition {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): SlotPosition => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

interface CardSwapProps {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  activeIndex?: number;
  children: ReactNode;
}

const CardSwap = ({
  width = 600,       
  height = 500,       
  cardDistance = 60,
  verticalDistance = 70,
  activeIndex = 0,
  children
}: CardSwapProps) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);

  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    [childArr.length]
  );

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;

    refs.forEach((r, i) => {
      const slot = makeSlot(i, cardDistance, verticalDistance, total);

      if (r.current) {
        gsap.set(r.current, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          xPercent: -50,
          yPercent: -50,
          zIndex: slot.zIndex
        });
      }
    });
  }, [refs, cardDistance, verticalDistance]);

  useEffect(() => {
    const total = refs.length;

    refs.forEach((ref, i) => {
      const position = (i - activeIndex + total) % total;
      const slot = makeSlot(position, cardDistance, verticalDistance, total);

      if (ref.current) {
        gsap.to(ref.current, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          duration: 0.8,
          ease: "power3.out"
        });
      }
    });
  }, [activeIndex, refs, cardDistance, verticalDistance]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) }
        } as any)
      : child
  );

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;