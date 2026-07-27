export function SiteFooter() {
  return (
    <footer className="bg-surface-container-lowest border-outline-variant border-t">
      <div className="max-w-container-max mx-auto flex w-full flex-col items-center justify-between gap-8 px-margin-desktop py-stack-lg md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface text-[24px]">
              shield
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">
              Guardia
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 Guardia Security. Your privacy is our priority.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a
            className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm underline transition-all"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm underline transition-all"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm underline transition-all"
            href="#"
          >
            Help Center
          </a>
        </div>
        <div className="flex gap-4">
          <div className="border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all">
            <span className="material-symbols-outlined">public</span>
          </div>
          <div className="border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all">
            <span className="material-symbols-outlined">mail</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
