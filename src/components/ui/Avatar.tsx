import { getInitials } from "../../utils";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const baseStyles =
    "rounded-full flex items-center justify-center font-medium";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${baseStyles} ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${baseStyles} ${sizes[size]} bg-primary-600 text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
