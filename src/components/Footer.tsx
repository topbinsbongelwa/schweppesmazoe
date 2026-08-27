import Image from "next/image";
import Link from "next/link";
import logo from "../public/landing-shop-logo-.png";

const categories = [
	{ label: "Mazoe", href: "/shop/mazoe_" },
	{ label: "Minute Maid", href: "/shop/minute_maid" },
	{ label: "Still Water", href: "/shop/still_water" },
	{ label: "Fruitade", href: "/shop/fruitade_" },
];

const socials = [
	{ label: "Facebook", symbol: "f", href: "https://www.facebook.com/" },
	{ label: "Instagram", symbol: "◎", href: "https://www.instagram.com/" },
	{ label: "LinkedIn", symbol: "in", href: "https://www.linkedin.com/" },
	{ label: "Twitter", symbol: "♥", href: "https://twitter.com/" },
];

export default function Footer() {
	return (
		<footer className="site-footer">
			<div className="footer-shell">
				<div className="footer-grid">
					<div className="footer-column footer-about">
						<Link href="/" className="footer-logo" aria-label="Schweppes Zimbabwe home">
							<Image src={logo} alt="Schweppes Zimbabwe Limited" width={205} height={110} />
						</Link>
						<h3>Schweppes Holdings Africa Limited</h3>
						<p>We are a leading manufacturer and distributor of<br className="desktop-break" /> liquid food and beverages.</p>
						<a className="corporate-link" href="https://schweppes.co.zw/" target="_blank" rel="noreferrer">Visit our corporate website</a>
					</div>

					<div className="footer-column">
						<h3>Quick Links</h3>
						<Link href="/terms"><span aria-hidden="true">→</span>Terms and conditions</Link>
						<Link href="/faq"><span aria-hidden="true">→</span>Frequently Asked Questions</Link>
						<Link href="/contact-us"><span aria-hidden="true">→</span>Contact Us</Link>
					</div>

					<div className="footer-column">
						<h3>Categories</h3>
						{categories.map((category) => (
							<Link href={category.href} key={category.label}><span aria-hidden="true">→</span>{category.label}</Link>
						))}
					</div>

					<div className="footer-column footer-contact">
						<h3>Contact Us</h3>
						<p>Address:67a Woolwich Rd Willowvale Harare</p>
						<p>Email: feedback@schweppes.co.zw</p>
						<p>Whatsapp: +263773079763</p>
						<div className="social-links" aria-label="Social media links">
							{socials.map((social) => <a href={social.href} key={social.label} aria-label={social.label} target="_blank" rel="noreferrer">{social.symbol}</a>)}
						</div>
					</div>
				</div>

				<div className="footer-bottom">
					<p>&copy; {new Date().getFullYear()} Schweppes Holdings Africa Limited. All Rights Reserved.</p>
					<div className="payment-methods" aria-label="Accepted payment methods">
						<div className="payment-row">
							<strong className="ecocash">Eco<span>Cash</span></strong>
							<strong className="money"><i>One</i>Money</strong>
							<strong className="zipit">ZIPIT</strong>
							<strong className="innbucks">InnBucks</strong>
						</div>
						<div className="payment-row payment-row-secondary">
							<strong className="paypal">PayPal</strong>
							<strong className="mastercard"><span /><i /></strong>
							<strong className="visa">VISA</strong>
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				.site-footer { color: #fff; background: #075c42; font-family: Arial, sans-serif; }
				.footer-shell { max-width: 1300px; margin: 0 auto; padding: 40px 40px 18px; }
				.footer-grid { display: grid; grid-template-columns: 1.35fr 1fr 1fr 1.35fr; }
				.footer-column { min-height: 150px; padding: 0 38px; border-left: 1px solid rgba(0,0,0,.45); }
				.footer-column:first-child { padding-left: 0; border-left: 0; }
				.footer-column h3 { margin: 0 0 25px; font-size: 16px; font-weight: 700; }
				.footer-about h3 { margin: 14px 0 7px; }
				.footer-logo { display: block; width: 205px; height: 67px; overflow: hidden; }
				.footer-logo img { width: 205px; height: 110px; object-fit: contain; object-position: center; filter: brightness(0) invert(1); }
				.footer-column p, .footer-column a { display: block; margin: 0 0 14px; color: #fff; font-size: 14px; line-height: 1.55; text-decoration: none; }
				.footer-column a span { display: inline-block; width: 26px; color: #81958d; font-size: 27px; line-height: 12px; vertical-align: -2px; }
				.footer-column a:hover { color: #f5c84b; }
				.corporate-link { margin-top: 37px !important; }
				.footer-contact p { margin-bottom: 17px; font-weight: 700; }
				.social-links { display: flex; gap: 13px; margin-top: 34px; }
				.social-links a { display: grid; width: 40px; height: 40px; margin: 0; place-items: center; border: 1px solid rgba(255,255,255,.35); border-radius: 50%; font-size: 16px; font-weight: 700; }
				.footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 30px; margin-top: 76px; }
				.footer-bottom p { margin: 0; font-size: 14px; }
				.payment-methods { min-width: 220px; padding: 8px 10px; color: #173b69; background: #fff; font-size: 12px; text-align: center; }
				.payment-row { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 24px; }
				.payment-row strong { display: inline-block; font-size: 12px; white-space: nowrap; }
				.ecocash { color: #279269; }
				.ecocash span { color: #efbd25; }
				.money { color: #173b69; font-size: 10px !important; }
				.money i { color: #f7941d; font-style: normal; }
				.zipit { color: #173b69; }
				.innbucks { color: #173b69; }
				.payment-row-secondary { gap: 24px; }
				.paypal { color: #173b69; font-size: 16px !important; }
				.mastercard { display: inline-flex !important; position: relative; width: 30px; height: 18px; }
				.mastercard span, .mastercard i { position: absolute; top: 1px; width: 16px; height: 16px; border-radius: 50%; }
				.mastercard span { left: 2px; background: #eb001b; }
				.mastercard i { left: 11px; background: #f79e1b; font-style: normal; opacity: .9; }
				.visa { color: #173b69; font-size: 16px !important; }
				@media (max-width: 800px) {
					.footer-shell { padding: 38px 22px 20px; }
					.footer-grid { grid-template-columns: repeat(2, 1fr); gap: 35px 0; }
					.footer-column { padding: 0 20px; }
					.footer-column:nth-child(3) { border-left: 0; padding-left: 0; }
					.footer-contact { padding-right: 0; }
					.footer-bottom { align-items: flex-start; flex-direction: column-reverse; margin-top: 45px; }
				}
				@media (max-width: 520px) {
					.footer-grid { grid-template-columns: 1fr; }
					.footer-column, .footer-column:nth-child(3) { padding: 0; border-left: 0; }
					.desktop-break { display: none; }
				}
			`}</style>
		</footer>
	);
}
