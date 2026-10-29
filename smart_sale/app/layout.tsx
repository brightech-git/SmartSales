import "./globals.css";
import { AllProviders } from "@/providers/AllProviders";
import { fontVariables } from "@/context/theme/font";

// Applies the saved palette and sidebar style before first paint so the
// app doesn't flash the default colours. Keys match APPEARANCE_STORAGE_KEYS
// in context/theme/themeContext.tsx.
const appearanceScript = `try{var d=document.documentElement;var p=localStorage.getItem("theme-palette");if(p)d.dataset.palette=p;var s=localStorage.getItem("theme-sidebar");if(s)d.dataset.sidebar=s;}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
      </head>
      <body>
        <AllProviders>
          {children}
        </AllProviders>
      </body>
    </html>
  );
}
