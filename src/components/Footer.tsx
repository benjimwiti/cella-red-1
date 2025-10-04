import { ThemeToggle } from "@/components/ui/theme-toggle";

const Footer = () => {
  return (
    <div className="text-center py-4 text-xs text-muted-foreground bg-background/50">
      © 2025 Hilley Jagero. All rights reserved under copyright law.
      <div className="flex justify-end pb-1">
+          <ThemeToggle />
+        </div>
    </div>

  );
};

export default Footer;