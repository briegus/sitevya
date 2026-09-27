import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import logo from "@/imports/657e8584-5d7e-45d0-84aa-8c15c5f80e83.png";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const LINKS = [
  { label: "Services", href: "services" },
  { label: "Réalisations", href: "realisations" },
  { label: "Avis", href: "avis" },
  { label: "FAQ", href: "faq" },
  { label: "À propos", href: "a-propos" },
  { label: "Contact", href: "contact" },
];

const DISCORD_INVITE = "https://discord.gg/6x7khm5kKc";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="glass-panel rounded-3xl p-8 md:p-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="Sitévya"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Votre présence web, créée autrement. Expériences web avancées et
              solutions pour bots Discord.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-white/45 hover:text-white text-sm transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Contact
            </p>
            <div className="space-y-3">
              <a
                href="mailto:sitevya@outlook.fr"
                className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                sitevya@outlook.fr
              </a>
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Discord Sitévya
              </a>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 sv-gradient-text text-sm hover:opacity-80 transition-opacity"
              >
                Espace client →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Sitévya. Tous droits réservés.
          </p>
          <p className="text-white/20 text-xs">
            Votre présence web, créée autrement.
          </p>
        </div>
      </div>
    </footer>
  );
}
