import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">
        <Image src="/schweppes-logo.png" alt="Schweppes" width={180} height={60} priority />
      </Link>

      <div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
}

