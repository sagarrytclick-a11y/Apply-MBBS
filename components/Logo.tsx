import React from "react";
import Image from "next/image";
import { SITE_IDENTITY } from "@/app/config/site_identity";

interface LogoProps {
  className?: string;
  imageWrapperClassName?: string;
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "h-12 w-auto object-contain",
  imageWrapperClassName,
}) => {
  const image = (
    <Image
      src={SITE_IDENTITY.logo.primary}
      alt={SITE_IDENTITY.name}
      width={294}
      height={220}
      className={className}
      priority
    />
  );

  return (
    <div className="flex items-center select-none">
      {imageWrapperClassName ? (
        <span className={imageWrapperClassName}>{image}</span>
      ) : (
        image
      )}
    </div>
  );
};

export default Logo;
