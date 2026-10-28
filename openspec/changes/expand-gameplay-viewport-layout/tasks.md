# Tasks

## 1. Responsive gutter composition

- [x] 1.1 Compose selected game status into the existing external gutter slots while preserving the centered portrait viewport; verify the gutter content is outside `#viewport` and viewport fitting is unchanged.
- [x] 1.2 Add responsive fallback behavior for narrow gutters and fullscreen, keeping primary actions and touch/keyboard controls in the viewport; verify the fallback conditions and control placement against the layout spec.

## 2. Expanded gameplay presentation and identity

- [x] 2.1 Reclaim in-viewport HUD space for the Babylon gameplay presentation without changing the 320×576 logical arena or camera framing; verify renderer sizing remains independent from responsive CSS layout.
- [x] 2.2 Update project naming to “Invaders of Space” while retaining “Space Invaders” as the display title; verify the title and related UI labels are consistent.
- [x] 2.3 Review fullscreen, resize, zoom, accessibility, and control interactions for the completed layout; verify requirements in the browser-template-layout delta.

## 3. Review preview

- [x] 3.1 Start exactly one Vite preview and present it for user review; stop and wait for the user's approval before any merge or commit.
