# Design Review Results: Winnipeg Salary Calculator

**Review Date**: February 15, 2026  
**Route**: / (Home Page)  
**Focus Areas**: All aspects (Visual Design, UX/Usability, Responsive/Mobile, Accessibility, Micro-interactions/Motion, Consistency, Performance)

## Summary

The Winnipeg Salary Calculator is a comprehensive, content-rich application with excellent contextual information and engaging trivia. However, it suffers from accessibility violations, inconsistent styling patterns, typography errors, and suboptimal information architecture. Found 25 issues across all categories: 4 critical accessibility violations, 8 high-priority UX and consistency issues, 10 medium visual/performance concerns, and 3 low-priority enhancements.

## Issues

| # | Issue | Criticality | Category | Location |
|---|-------|-------------|----------|----------|
| 1 | External links missing `rel="noopener noreferrer"` security attribute | 🔴 Critical | Accessibility | `src/react-app/pages/Home.tsx:40,594` |
| 2 | Form inputs lack accessible labels (violates WCAG 4.1.2) | 🔴 Critical | Accessibility | `src/react-app/components/SalaryForm.tsx:46-52,61-70,78-87` |
| 3 | No visible keyboard focus indicators on interactive elements | 🔴 Critical | Accessibility | `src/react-app/index.css` (missing :focus-visible styles) |
| 4 | Google Fonts request failing (ERR_ABORTED), no fallback fonts loading | 🔴 Critical | Performance | `src/react-app/index.css:1` |
| 5 | Typo: `clay-input` used instead of `theme-input` causing inconsistent styling | 🟠 High | Consistency | `src/react-app/components/SalaryForm.tsx:82,127,140,153` |
| 6 | Typo: `clay-surface` used instead of `theme-surface` breaking theme consistency | 🟠 High | Consistency | `src/react-app/components/SalaryBreakdown.tsx:95,99` |
| 7 | Invalid Tailwind color classes: `text-grey-200`, `text-grey-100`, `text-black-100` don't exist | 🟠 High | Visual Design | `src/react-app/pages/Home.tsx:575,578,588` |
| 8 | Poor information hierarchy - 5,600+ line single-page component overwhelming users | 🟠 High | UX/Usability | `src/react-app/pages/Home.tsx:1-600` |
| 9 | Navigation pills link to page anchors but no smooth scroll behavior implemented | 🟠 High | Micro-interactions | `src/react-app/pages/Home.tsx:64-92` |
| 10 | Sticky header has `backdrop-blur-xl` but no backdrop-filter support check | 🟠 High | Responsive | `src/react-app/pages/Home.tsx:33` |
| 11 | Missing skip-to-content link for keyboard users to bypass lengthy header/intro | 🟠 High | Accessibility | `src/react-app/pages/Home.tsx:30-48` |
| 12 | "Show Additional Options" button has transparent background making it hard to identify as clickable | 🟠 High | Visual Design | `src/react-app/components/SalaryForm.tsx:91-101` |
| 13 | Inconsistent icon sizing - icons range from w-4 to w-8 without clear system | 🟡 Medium | Visual Design | `src/react-app/pages/Home.tsx:37,42,68-90` |
| 14 | Tax breakdown cards have hardcoded background colors instead of theme variables | 🟡 Medium | Consistency | `src/react-app/components/SalaryBreakdown.tsx:34-40` |
| 15 | No loading state while calculation runs (happens on every input change) | 🟡 Medium | UX/Usability | `src/react-app/pages/Home.tsx:21-24` |
| 16 | Calculation runs on every keystroke instead of debounced input | 🟡 Medium | Performance | `src/react-app/pages/Home.tsx:21-24,26-28` |
| 17 | Random trivia selection happens on every render, should be memoized | 🟡 Medium | Performance | `src/react-app/components/SalaryBreakdown.tsx:211` |
| 18 | Deduction perspective section has overly complex inline calculations reducing readability | 🟡 Medium | Consistency | `src/react-app/components/SalaryBreakdown.tsx:148-170` |
| 19 | Gradient classes `theme-gradient-*` defined but not using CSS variables consistently | 🟡 Medium | Consistency | `src/react-app/index.css:123-137` |
| 20 | Header link not using button/link component, directly using anchor tag | 🟡 Medium | Consistency | `src/react-app/pages/Home.tsx:40` |
| 21 | Large bundle size (2.7MB) due to Lucide importing full icon set instead of tree-shaking | 🟡 Medium | Performance | Performance metrics show 2.7MB page size |
| 22 | "Coffee Coin" and comparison sections not keyboard accessible (need tabindex) | 🟡 Medium | Accessibility | `src/react-app/pages/Home.tsx:421-592` |
| 23 | No visual indication that page has dark mode support (missing toggle UI) | ⚪ Low | UX/Usability | Theme system exists but no user control |
| 24 | Missing print stylesheet - calculator would print poorly | ⚪ Low | UX/Usability | No print media queries defined |
| 25 | No share or export functionality for salary breakdown results | ⚪ Low | UX/Usability | Feature gap - users may want to save/share results |

## Criticality Legend
- 🔴 **Critical**: Breaks functionality or violates accessibility standards
- 🟠 **High**: Significantly impacts user experience or design quality
- 🟡 **Medium**: Noticeable issue that should be addressed
- ⚪ **Low**: Nice-to-have improvement

## Next Steps

### Immediate (Critical Issues - Week 1)
1. **Fix accessibility violations**: Add proper ARIA labels to all form inputs, add rel="noopener" to external links, implement visible focus indicators
2. **Fix font loading**: Host Google Fonts locally or add proper fallbacks to prevent layout shift
3. **Fix typos**: Replace all `clay-*` with `theme-*` classes, fix invalid Tailwind color classes

### High Priority (High Issues - Week 2)
4. **Improve information architecture**: Break down the 600-line component into smaller, focused sections or separate routes
5. **Add smooth scrolling**: Implement smooth scroll behavior for anchor links
6. **Enhance button visibility**: Make "Show Additional Options" button more prominent with proper theme-button styling
7. **Add skip link**: Implement keyboard-accessible skip-to-content navigation

### Medium Priority (Medium Issues - Week 3-4)
8. **Optimize performance**: Debounce input changes, memoize random trivia, implement tree-shaking for icons
9. **Improve consistency**: Create design token system for icon sizes, use CSS variables everywhere
10. **Add loading states**: Show visual feedback during calculations

### Low Priority (Low Issues - Future)
11. **Add dark mode toggle**: Make the existing dark mode accessible via UI control
12. **Implement print styles**: Add print-friendly stylesheet
13. **Add share functionality**: Allow users to export or share their salary breakdown

## Positive Observations

- **Rich contextual content**: Excellent use of Winnipeg-specific examples (Slurpees, sunshine hours, etc.)
- **Strong design system foundation**: CSS variables and theme system well-structured
- **Good visual hierarchy**: Clear separation between sections with cards and gradients
- **Performant**: Excellent web vitals (FCP: 1.5s, CLS: 0.001, no TBT)
- **Engaging UX**: Fun facts and trivia make tax calculations more engaging
- **Comprehensive**: Covers all aspects of salary calculation with detailed breakdowns

## Recommended Design Pattern Improvements

1. **Sticky Calculator**: Make the calculator form sticky on desktop so users can adjust inputs while viewing results
2. **Tabbed Results**: Group perspectives, comparisons, and trivia into tabs to reduce visual overwhelm
3. **Accordion for Tax Rates**: Collapse the lengthy tax rate tables into expandable sections
4. **Visual Progress Bar**: Add visual representation of deduction breakdown (not just numbers)
5. **Comparison Grid**: Make the "What Could You Buy" section more visually scannable with icons and cards
