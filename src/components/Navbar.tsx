import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">
        <Image src="/logo.PNG" alt="Mazoe" width={120} height={40} />
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

