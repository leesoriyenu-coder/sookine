import React, { useState } from "react";
import styles from "./Card.module.css";
import { cn } from "@/lib/utils/cn";
import { Badge } from "../Badge/Badge";

// --- 1. Base Card Component ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const Card = ({ children, className, hoverEffect = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        styles.card,
        hoverEffect && styles.cardHover,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// --- Image Fallback Component (Helper) ---
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText: string;
  className?: string;
}

const ImageWithFallback = ({ src, alt, fallbackText, className, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div className={styles.fallbackImage}>
        <span className={styles.fallbackLogo}>🥢</span>
        <span>{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

// --- 2. Card.Menu Component ---
interface CardMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  note: string | null;
  isSeasonal?: boolean;
  isSignature?: boolean;
  onImageClick?: () => void;
}

const CardMenu = ({
  name,
  price,
  description,
  imageUrl,
  note,
  isSeasonal = false,
  isSignature = false,
  className,
  onImageClick,
  ...props
}: CardMenuProps) => {
  return (
    <div className={cn(styles.card, styles.menuCard, className)} {...props}>
      <div 
        className={cn(styles.imageArea, onImageClick && "cursor-pointer")}
        onClick={onImageClick}
      >
        <ImageWithFallback
          src={imageUrl || ""}
          alt={name}
          fallbackText={name}
          className={styles.menuImage}
        />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.headerRow}>
          <h4 className={styles.menuName}>{name}</h4>
          <span className={styles.menuPrice}>{price.toLocaleString()}원</span>
        </div>
        <p className={styles.menuDesc}>{description || "엄마의 손맛이 가득 담긴 정갈한 메뉴입니다."}</p>
        {(note || isSeasonal || isSignature) && (
          <div className={styles.menuFooter}>
            {isSignature && <Badge variant="signature">대표</Badge>}
            {isSeasonal && <Badge variant="seasonal">시즌</Badge>}
            {note && <span className={styles.menuNote}>{note}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. Card.MenuSignature Component ---
const CardMenuSignature = ({
  name,
  price,
  description,
  imageUrl,
  note,
  isSeasonal = false,
  className,
  onImageClick,
  ...props
}: CardMenuProps) => {
  return (
    <div className={cn(styles.card, styles.signatureCard, className)} {...props}>
      <div 
        className={cn(styles.sigImageArea, onImageClick && "cursor-pointer")}
        onClick={onImageClick}
      >
        <ImageWithFallback
          src={imageUrl || ""}
          alt={name}
          fallbackText={name}
          className={styles.menuImage}
        />
      </div>
      <div className={styles.sigContentArea}>
        <div className={styles.sigBadgeRow}>
          <Badge variant="signature">대표 메뉴</Badge>
          {isSeasonal && <Badge variant="seasonal">시즌</Badge>}
        </div>
        <h3 className={styles.sigName}>{name}</h3>
        <div className={styles.sigPrice}>{price.toLocaleString()}원</div>
        <p className={styles.sigDesc}>{description || "매장 대표 식사 메뉴입니다."}</p>
        {note && (
          <div className={styles.menuFooter} style={{ borderTop: "none", paddingTop: 0 }}>
            <span className={styles.menuNote}>💡 {note}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 4. Card.SideDish Component ---
interface CardSideDishProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  imageUrl: string | null;
  onImageClick?: () => void;
}

const CardSideDish = ({ name, imageUrl, className, onImageClick, ...props }: CardSideDishProps) => {
  return (
    <div 
      className={cn(styles.card, styles.sideDishCard, className)} 
      onClick={onImageClick}
      {...props}
    >
      <div className={styles.sideDishImageArea}>
        <ImageWithFallback
          src={imageUrl || ""}
          alt={name}
          fallbackText={name}
          className={styles.sideDishImage}
        />
      </div>
      <div className={styles.sideDishName}>{name}</div>
    </div>
  );
};

// Attach sub-components to Card
Card.Menu = CardMenu;
Card.MenuSignature = CardMenuSignature;
Card.SideDish = CardSideDish;
