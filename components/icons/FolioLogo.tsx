import Image from "next/image"

export function FolioLogo({ className = "w-auto h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[1.5px]  ${className}`}>
      <Image
        src="/site-logo.png"
        alt="Unrealshot AI Logo"
        width={24}
        height={24}
        className="w-7 h-7 shrink-0 rounded sm:w-8 sm:h-8"
      />
      <span className="text-base min-[360px]:text-lg sm:text-xl font-bold text-gray-700 font-mono ml-1">
        Unrealshot
      </span>
    </div>
  )
}
