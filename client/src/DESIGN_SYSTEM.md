# NxtConnect Design System

Professional, trustworthy, and scalable UI system for the mentorship platform.

## 📁 File Structure

```
src/
├── components/
│   ├── ui/                      # Core reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Textarea.jsx
│   │   ├── Select.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Avatar.jsx
│   │   ├── Modal.jsx
│   │   ├── Tabs.jsx
│   │   ├── Skeleton.jsx
│   │   ├── EmptyState.jsx
│   │   ├── StatCard.jsx
│   │   ├── Tooltip.jsx
│   │   └── index.js
│   ├── layout/
│   │   ├── AppLayout.jsx        # Main layout wrapper
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── TopBar.jsx           # Top bar with mobile menu
│   │   └── Navbar.jsx           # Original navbar (deprecated)
│   ├── common/                  # Feature-specific components
│   ├── events/
│   ├── feed/
│   ├── mentor/
│   ├── notifications/
│   └── student/
├── styles/
│   ├── theme.css                # Design tokens & utilities
│   └── index.css                # Main stylesheet
├── pages/                        # Page components
│   ├── Dashboard.jsx            # ✅ Refactored example
│   ├── Mentorbrowse.jsx
│   ├── Chat.jsx
│   └── ...
├── context/                     # React contexts
└── api/                         # API layer

tailwind.config.js              # Tailwind configuration with design tokens
```

## 🎨 Design Tokens

### Colors
```javascript
// Primary - Deep blue (trust, professionalism)
primary-50 to primary-900

// Semantic Colors
success-600   // #16a34a - Positive actions
warning-600   // #f59e0b - Cautions
error-600     // #dc2626 - Destructive actions
info-600      // #3b82f6 - Informational

// Neutrals
slate-50 to slate-900
```

### Typography
```
h1:  32px, font-bold, tracking-tight
h2:  28px, font-bold, tracking-tight
h3:  24px, font-bold, leading-tight
h4:  20px, font-semibold, leading-snug
h5:  18px, font-semibold, leading-snug
h6:  16px, font-semibold, leading-snug

body:     14px, text-slate-700, line-height-1.5
body-sm:  13px, text-slate-600
label:    13px, font-medium, text-slate-900
meta:     12px, text-slate-500, uppercase
```

### Spacing (4px scale)
```
xs:  4px
sm:  8px
md:  12px (common)
lg:  16px (common)
xl:  24px
2xl: 32px
3xl: 48px
4xl: 64px
5xl: 80px
```

### Border Radius
```
xs: 4px   (small elements)
sm: 6px   (buttons, small cards)
md: 8px   (standard cards, inputs)
lg: 12px  (large cards, modals)
xl: 16px  (hero sections)
```

### Shadows (elevation)
```
xs: subtle (hover states)
sm: default (cards, dropdowns)
md: elevated (modals, popovers)
lg: prominent (floating sections)
xl: highest (modals with content)
```

### Transitions
```
fast:  150ms ease-in-out
base:  200ms ease-in-out
slow:  300ms ease-in-out
```

## 🧱 Core Components

### Button
```jsx
import { Button } from '../components/ui';

// Variants: primary, secondary, ghost, danger, success, outline
// Sizes: xs, sm, md, lg

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

**Features:**
- 6 variants (primary, secondary, ghost, danger, success, outline)
- 4 sizes (xs, sm, md, lg)
- Loading state with spinner
- Focus ring for accessibility
- Disabled state

### Input
```jsx
<Input
  label="Email"
  placeholder="user@example.com"
  error={errorMessage}
  helper="We'll never share your email"
  icon={MailIcon}
/>
```

**Features:**
- Optional label, error, and helper text
- Icon support (left position)
- Validation styling
- Responsive

### Card
```jsx
<Card elevated={false}>
  <Card.Header>Header content</Card.Header>
  <Card.Body>Main content</Card.Body>
  <Card.Footer>Footer with actions</Card.Footer>
</Card>
```

**Features:**
- Composable sections
- Elevation variant
- Dividers between sections

### Badge
```jsx
<Badge variant="success" size="md" icon={CheckIcon}>
  Approved
</Badge>
```

**Variants:** default, primary, success, warning, error, info
**Sizes:** sm, md, lg

### Avatar
```jsx
<Avatar
  src={imageUrl}
  initials="JD"
  size="md"
  status="online"
/>
```

**Features:**
- Image or initials fallback
- Sizes: xs, sm, md, lg, xl
- Status indicator (online, away, offline)
- Circular with ring

### Modal
```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
  size="md"
  actions={[
    { label: 'Cancel', variant: 'secondary', onClick: () => {} },
    { label: 'Delete', variant: 'danger', onClick: handleDelete },
  ]}
>
  <p>This action cannot be undone.</p>
</Modal>
```

**Features:**
- Animated entrance
- Backdrop with blur
- Header with close button
- Customizable footer actions
- Sizes: sm, md, lg, xl

### Tabs
```jsx
<Tabs
  defaultTab={0}
  onChange={(idx) => console.log(idx)}
  items={[
    { label: 'Tab 1', icon: null, content: <div>Content 1</div> },
    { label: 'Tab 2', icon: <Icon />, content: <div>Content 2</div> },
  ]}
/>
```

### StatCard
```jsx
<StatCard
  label="Revenue"
  value="$42,500"
  icon={DollarIcon}
  trend="↑ 12%"
  change="vs last month"
  changeType="positive"
/>
```

### EmptyState
```jsx
<EmptyState
  icon={InboxIcon}
  title="No items found"
  description="Try adjusting your filters or creating a new item."
  action={{
    label: 'Create Item',
    onClick: () => { /* ... */ },
  }}
/>
```

### Skeleton
```jsx
<Skeleton variant="text" width="100%" height="20px" count={3} />
<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="rect" width="100%" height="200px" />
```

### Tooltip
```jsx
<Tooltip content="Helpful information" position="top">
  <button>Hover me</button>
</Tooltip>
```

**Positions:** top, bottom, left, right

## 🏗️ Layout System

### AppLayout
Wraps all authenticated pages with sidebar + topbar

```jsx
import AppLayout from '../components/layout/AppLayout';

export default function MyPage() {
  return (
    <AppLayout>
      <h1>Page content</h1>
      <p>Content automatically has proper spacing</p>
    </AppLayout>
  );
}
```

**Features:**
- Sticky navigation
- Mobile-responsive sidebar
- Proper spacing containers
- Automatic content area

### Using in App.jsx
Update your App.jsx to use AppLayout for authenticated pages:

```jsx
<ProtectedRoute>
  <AppLayout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mentors" element={<MentorBrowse />} />
      {/* ... */}
    </Routes>
  </AppLayout>
</ProtectedRoute>
```

## 📐 Layout Classes

```css
.container-tight   /* max-w-4xl */
.container-wide    /* max-w-7xl */
.container-full    /* full width */

.flex-center       /* flex, items-center, justify-center */
.flex-between      /* flex, items-center, justify-between */

.surface           /* white card with subtle shadow */
.surface-lg        /* larger card with more shadow */
.surface-elevated  /* prominent elevation */
.surface-muted     /* light gray background */

.line-clamp-1      /* single line with ... */
.line-clamp-2      /* two lines with ... */
.line-clamp-3      /* three lines with ... */

.transition-fast   /* 150ms transition */
.transition-base   /* 200ms transition */
.transition-slow   /* 300ms transition */

.hover-lift        /* hover: shadow + -translate-y-1 */
.hover-darken      /* hover: bg-slate-100 */
```

## 🎯 Page Refactoring Guide

### 1. Import Layout & Components
```jsx
import AppLayout from '../components/layout/AppLayout';
import { Button, Card, Badge, Input } from '../components/ui';
```

### 2. Replace Old Styling
**Before:**
```jsx
<div className="card text-center py-4">
  <Icon size={20} className="text-blue-700 mx-auto mb-2" />
  <div className="text-2xl font-semibold text-slate-900">value</div>
</div>
```

**After:**
```jsx
<StatCard
  label="Connections"
  value={42}
  icon={Users}
  trend="↑ 3"
  change="This week"
/>
```

### 3. Use AppLayout Wrapper
```jsx
export default function MyPage() {
  return (
    <AppLayout>
      {/* Content with automatic spacing */}
    </AppLayout>
  );
}
```

### 4. Update Colors
**Old:** `text-blue-700`, `bg-emerald-600`, `text-red-600`
**New:** `text-primary-600`, `bg-success-600`, `text-error-600`

### 5. Update Typography
**Old:** `text-2xl font-semibold`
**New:** `text-h4` or `text-2xl font-bold` + `text-slate-900`

### 6. Use New Components
Replace custom card layouts with `Card`, `Badge`, `Avatar`, etc.

## 📱 Responsive Design

All components are mobile-first responsive:
- **Mobile:** Single column, bottom navigation
- **Tablet:** 2-3 columns, hamburger menu
- **Desktop:** Full layout, sidebar visible

Sidebar auto-hides on mobile (< 1024px) and shows in TopBar menu.

## 🔧 Customization

### Override Spacing
```jsx
<div className="px-6 py-8">Custom spacing</div>
```

### Override Colors
```jsx
<div className="bg-primary-100 text-primary-700">Custom colors</div>
```

### Custom Typography
```jsx
<h1 className="text-h1">Heading 1</h1>
```

## ⚡ Performance Tips

1. **Use Skeleton loaders** while loading
2. **Lazy load images** with Avatar
3. **Memoize components** that don't change often
4. **Use debounce** for search inputs
5. **Virtualize long lists** (component not included)

## 🔐 Accessibility

All components follow WCAG 2.1 AA standards:
- Focus rings on interactive elements
- Color contrast >= 4.5:1
- Keyboard navigation
- ARIA labels where needed
- Semantic HTML

## 📚 Examples

See refactored pages:
- ✅ [Dashboard.jsx](./pages/Dashboard.jsx) - Stats, cards, empty states
- (Add more examples as pages are refactored)

## 🚀 Migration Checklist

When refactoring a page:
- [ ] Import AppLayout
- [ ] Remove old navbar wrapper
- [ ] Replace custom cards with Card component
- [ ] Replace inline buttons with Button component
- [ ] Update color classes (blue → primary, green → success)
- [ ] Use StatCard for stats sections
- [ ] Use Badge for status labels
- [ ] Use Avatar for user images
- [ ] Use EmptyState for empty screens
- [ ] Test on mobile (resize browser)
- [ ] Check focus rings (Tab key)
- [ ] Verify color contrast

---

**Last Updated:** April 2026
**Version:** 1.0.0
