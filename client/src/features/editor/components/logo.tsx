import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="size-6 md:size-8 w-12 md:w-22 relative shrink-0">
        <Image
          src="/logo.png"
          fill
          alt="The Canvas"
          className="shrink-0 hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};
