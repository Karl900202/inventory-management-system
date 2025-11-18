"use client";

type CommonButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export default function CommonButton({
  children,
  onClick,
  className = "",
}: CommonButtonProps) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
