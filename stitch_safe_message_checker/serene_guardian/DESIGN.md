---
name: Serene Guardian
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is centered on **Reassurance, Clarity, and Trust**. Its primary mission is to transform a stressful situation—suspected fraud—into a manageable, calm experience. The brand personality is that of a "wise companion": knowledgeable and protective without being alarmist or technical.

The design style is **Modern Corporate with a Soft Edge**. It utilizes generous whitespace, subtle tonal layering, and a focus on high-readability typography to ensure the user never feels overwhelmed. By avoiding the aggressive reds and high-contrast warnings typical of security software, this design system fosters an environment of deliberate, rational decision-making. 

**Emotional Response:**
- **Safety:** A sense of being shielded by an expert.
- **Clarity:** Complex technical threats are translated into simple, actionable insights.
- **Calm:** Reducing the user's heart rate through soft aesthetics and patient interaction patterns.

## Colors

This color palette is strategically designed to communicate security through stability rather than urgency.

- **Primary (Assurance Blue):** Used for primary actions and brand presence. Blue signifies intelligence and reliability.
- **Secondary (Safe Green):** Reserved for "Safe" statuses and successful verification. It provides immediate positive reinforcement.
- **Tertiary (Caution Gold):** A soft amber used for warnings. It is intentionally non-red to signal "proceed with caution" rather than "panic."
- **Neutral (Slate):** Used for typography and secondary UI elements to maintain a grounded, professional feel.
- **Backgrounds:** Predominantly clean whites (`#FFFFFF`) and very soft blue-greys (`#F8FAFC`) to minimize visual noise.

## Typography

The typography strategy prioritizes **Accessibility and Precision**. 

We use **Manrope** for headings to provide a modern, balanced, and structural feel. It commands authority without appearing harsh. For all body text and interface labels, we utilize **Atkinson Hyperlegible Next**. This font is specifically designed for maximum legibility, ensuring that users—especially those in high-stress states or with visual impairments—can accurately digest critical security information without errors.

**Usage Rules:**
- Keep line lengths for body text between 45-75 characters for optimal reading comfort.
- Use `headline-lg` sparingly for major screen titles to maintain a sense of calm.
- All body text should utilize a high-contrast neutral color (Slate 900) against white backgrounds.

## Layout & Spacing

The layout follows a **Fluid Content Model** within a fixed-width container. It emphasizes "breathing room" to reduce the cognitive load of the user.

- **Grid:** A 12-column grid for desktop, 4-column for mobile.
- **Vertical Rhythm:** Information is stacked using a consistent 8px base unit. Large gaps (32px+) are encouraged between different logical sections to prevent the UI from feeling "crowded" or "scam-like."
- **Mobile First:** Given that many scams occur via SMS/Mobile, the layout must be highly responsive. Elements reflow into a single column with increased touch targets (minimum 48px height).
- **Safe Margins:** Deep horizontal margins on desktop (40px+) keep the content centered and focused, preventing the user's eyes from wandering.

## Elevation & Depth

This design system uses **Tonal Layers** and **Ambient Shadows** to create a sense of organized hierarchy.

- **Base Layer:** The primary background is a flat, soft grey-white.
- **Surface Layer:** White cards represent "active" content. They use a very soft, diffused shadow (15% opacity, 20px blur, 4px offset) to appear slightly lifted.
- **Interactions:** When a user interacts with a suspected scam link or file, the elevation increases slightly to indicate focus, but never uses "floating" or "glass" effects that might appear too trendy or untrustworthy to a non-technical user.
- **Outlines:** Subtle 1px borders in a light grey-blue (`#E2E8F0`) are used instead of heavy shadows for input fields and static containers to maintain a "clean paper" feel.

## Shapes

The shape language is **Rounded and Organic**. 

We use a `0.5rem` (8px) base radius for standard containers and buttons. This avoids the "sharpness" of technical tools while staying more professional than "bubbly" consumer apps. 

- **Standard Elements:** 8px radius (e.g., Input fields, Cards).
- **Prominent Actions:** Large CTA buttons use a `1rem` (16px) radius to feel inviting to the touch.
- **Status Indicators:** Small chips or tags use a fully pill-shaped radius to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons are solid Assurance Blue with white text. Secondary buttons use a "ghost" style with a 1px border. No gradients are allowed; solid colors feel more honest and stable.
- **Information Cards:** These are the primary vessel for scam analysis. They must feature a clear header, a 16px internal padding, and use the "Secondary Green" or "Tertiary Gold" as a small side-accent bar to indicate status.
- **Input Fields:** Large, clearly labeled fields with 16px padding. Focused states use a 2px Assurance Blue border.
- **Analysis Chips:** Used to tag specific red flags (e.g., "Urgent Language," "Unknown Sender"). These should have a light tinted background and a darker text version of the same hue.
- **Progress Steppers:** Use soft, pulsing circular indicators when "scanning" or "analyzing." The motion should be slow and rhythmic to maintain the "calm" brand pillar.
- **Action Drawers:** On mobile, critical decisions (e.g., "Block Sender") should emerge from the bottom in a rounded drawer, keeping the focus on the user's thumb and providing a tactile sense of control.