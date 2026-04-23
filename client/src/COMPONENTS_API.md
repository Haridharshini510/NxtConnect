# NxtConnect UI Components - API Reference

Complete API documentation for all reusable UI components.

## Table of Contents
1. [Button](#button)
2. [Input](#input)
3. [Textarea](#textarea)
4. [Select](#select)
5. [Card](#card)
6. [Badge](#badge)
7. [Avatar](#avatar)
8. [Modal](#modal)
9. [Tabs](#tabs)
10. [Skeleton](#skeleton)
11. [EmptyState](#emptystate)
12. [StatCard](#statcard)
13. [Tooltip](#tooltip)

---

## Button

Versatile button component with multiple variants and sizes.

### Import
```jsx
import { Button } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success' \| 'outline'` | `'primary'` | Button style variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `ReactNode` | Required | Button text/content |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |

### Examples
```jsx
// Primary action
<Button variant="primary" size="md">
  Save Changes
</Button>

// Loading state
<Button isLoading={isSubmitting} disabled={isSubmitting}>
  Submitting...
</Button>

// Different variants
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">More Options</Button>
<Button variant="success">Approve</Button>
<Button variant="outline">Learn More</Button>

// Different sizes
<Button size="xs">Tiny</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

---

## Input

Text input component with validation, icons, and helper text.

### Import
```jsx
import { Input } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value |
| `onChange` | `(e) => void` | - | Change handler |
| `error` | `string` | - | Error message |
| `helper` | `string` | - | Helper text (below input) |
| `icon` | `ReactComponent` | - | Icon component (left) |
| `disabled` | `boolean` | `false` | Disable input |
| `required` | `boolean` | `false` | Required field |
| `type` | `string` | `'text'` | HTML input type |

### Examples
```jsx
// Basic input
<Input placeholder="Enter name" />

// With label and helper
<Input
  label="Email"
  placeholder="user@example.com"
  helper="We'll never share your email"
/>

// With error state
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// With icon
import { Mail } from 'lucide-react';
<Input
  label="Email"
  icon={Mail}
  placeholder="user@example.com"
/>

// Disabled
<Input disabled label="Read-only" value="Cannot edit" />
```

---

## Textarea

Multi-line text input component.

### Import
```jsx
import { Textarea } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `rows` | `number` | `4` | Number of rows |
| `value` | `string` | - | Input value |
| `onChange` | `(e) => void` | - | Change handler |
| `error` | `string` | - | Error message |
| `helper` | `string` | - | Helper text |

### Examples
```jsx
// Basic textarea
<Textarea placeholder="Write your message..." />

// With label
<Textarea
  label="Description"
  rows={6}
  placeholder="Tell us more..."
/>

// With character limit
const [text, setText] = useState('');
const max = 500;

<>
  <Textarea
    label="Bio"
    value={text}
    onChange={(e) => setText(e.target.value)}
    error={text.length > max ? `Max ${max} characters` : ''}
  />
  <p className="text-xs text-slate-500 mt-1">
    {text.length} / {max}
  </p>
</>
```

---

## Select

Dropdown select component with validation.

### Import
```jsx
import { Select } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label |
| `value` | `string` | - | Selected value |
| `onChange` | `(e) => void` | - | Change handler |
| `options` | `Array<{label, value}>` | `[]` | Select options |
| `error` | `string` | - | Error message |
| `helper` | `string` | - | Helper text |
| `disabled` | `boolean` | `false` | Disable select |

### Examples
```jsx
// Basic select
<Select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  options={[
    { label: 'Student', value: 'student' },
    { label: 'Mentor', value: 'mentor' },
    { label: 'Admin', value: 'admin' },
  ]}
/>

// With label and error
<Select
  label="Department"
  value={dept}
  onChange={(e) => setDept(e.target.value)}
  options={departments}
  error={deptError}
/>
```

---

## Card

Container component with optional sections.

### Import
```jsx
import { Card } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevated` | `boolean` | `false` | Add elevation shadow |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | Required | Card content |

### Sub-components
- `Card.Header` - Header section with background
- `Card.Body` - Main content area
- `Card.Footer` - Footer section with background

### Examples
```jsx
// Simple card
<Card>
  <Card.Body>
    <h3>Title</h3>
    <p>Content</p>
  </Card.Body>
</Card>

// Card with all sections
<Card elevated>
  <Card.Header>
    <h3 className="font-bold">Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Main content goes here</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </Card.Footer>
</Card>

// Clickable card
<Link to="/details">
  <Card className="hover:shadow-lg cursor-pointer">
    <Card.Body>Content</Card.Body>
  </Card>
</Link>
```

---

## Badge

Status/label component for categorization.

### Import
```jsx
import { Badge } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Badge style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `icon` | `ReactComponent` | - | Optional icon |
| `children` | `ReactNode` | Required | Badge text |

### Examples
```jsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>

// With icons
import { Check, AlertCircle } from 'lucide-react';

<Badge variant="success" icon={Check}>
  Approved
</Badge>

<Badge variant="warning" icon={AlertCircle}>
  Review needed
</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

---

## Avatar

User profile picture with fallback.

### Import
```jsx
import { Avatar } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image URL |
| `initials` | `string` | - | Fallback initials |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `status` | `'online' \| 'away' \| 'offline'` | - | Status indicator |
| `alt` | `string` | `'Avatar'` | Image alt text |

### Examples
```jsx
// With image
<Avatar
  src={user.profilePhoto}
  initials={user.name?.[0]}
  size="md"
/>

// With status
<Avatar
  src={user.profilePhoto}
  initials={user.name?.[0]}
  size="md"
  status="online"
/>

// Fallback to initials
<Avatar
  initials="JD"
  size="lg"
/>

// Different sizes
<Avatar initials="AB" size="xs" />  {/* 24px */}
<Avatar initials="AB" size="sm" />  {/* 32px */}
<Avatar initials="AB" size="md" />  {/* 40px */}
<Avatar initials="AB" size="lg" />  {/* 48px */}
<Avatar initials="AB" size="xl" />  {/* 64px */}
```

---

## Modal

Dialog/modal component for important actions.

### Import
```jsx
import { Modal } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Show/hide modal |
| `onClose` | `() => void` | Required | Close handler |
| `title` | `string` | - | Modal title |
| `description` | `string` | - | Modal description |
| `children` | `ReactNode` | - | Modal content |
| `actions` | `Array<Action>` | - | Footer buttons |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal width |
| `isDangerous` | `boolean` | `false` | Warning styling |

### Action Object
```jsx
{
  label: string,          // Button text
  variant: string,        // 'primary' | 'secondary' | 'danger'
  onClick: () => void,    // Click handler
  keepOpen: boolean,      // Don't close on click
}
```

### Examples
```jsx
// Confirmation modal
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
  actions={[
    { label: 'Cancel', variant: 'secondary' },
    { label: 'Confirm', variant: 'primary', onClick: handleConfirm },
  ]}
>
  <p>This action cannot be undone.</p>
</Modal>

// Dangerous action modal
<Modal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  title="Delete item?"
  description="This is permanent"
  isDangerous={true}
  size="sm"
  actions={[
    { label: 'Keep', variant: 'secondary' },
    { label: 'Delete', variant: 'danger', onClick: handleDelete },
  ]}
>
  <p>All data will be lost.</p>
</Modal>
```

---

## Tabs

Tabbed content switcher.

### Import
```jsx
import { Tabs } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<TabItem>` | Required | Tab definitions |
| `defaultTab` | `number` | `0` | Default active tab |
| `onChange` | `(idx) => void` | - | Tab change handler |

### TabItem Object
```jsx
{
  label: string,        // Tab label
  icon: ReactComponent, // Optional icon
  content: ReactNode,   // Tab content
}
```

### Examples
```jsx
// Basic tabs
<Tabs
  items={[
    { label: 'Overview', content: <Overview /> },
    { label: 'Details', content: <Details /> },
    { label: 'Settings', content: <Settings /> },
  ]}
/>

// With icons
import { Home, Cog, Bell } from 'lucide-react';

<Tabs
  defaultTab={1}
  onChange={(idx) => console.log('Switched to', idx)}
  items={[
    { label: 'Home', icon: <Home size={16} />, content: <Home /> },
    { label: 'Settings', icon: <Cog size={16} />, content: <Settings /> },
    { label: 'Notifications', icon: <Bell size={16} />, content: <Notifs /> },
  ]}
/>
```

---

## Skeleton

Loading placeholder for content.

### Import
```jsx
import { Skeleton } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'text'` | Skeleton shape |
| `width` | `string` | `'100%'` | Width CSS value |
| `height` | `string` | `'20px'` | Height CSS value |
| `count` | `number` | `1` | Number of skeletons |
| `className` | `string` | - | Additional CSS classes |

### Examples
```jsx
// Text loading
<Skeleton variant="text" count={3} />

// Avatar loading
<Skeleton variant="circle" width="40px" height="40px" />

// Card loading
<Skeleton variant="rect" width="100%" height="200px" />

// Complex loading
<div className="space-y-4">
  <Skeleton variant="rect" width="40px" height="40px" />
  <Skeleton variant="text" count={2} />
  <Skeleton variant="rect" width="100%" height="100px" />
</div>
```

---

## EmptyState

Empty state placeholder with icon and action.

### Import
```jsx
import { EmptyState } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactComponent` | `Inbox` | Empty state icon |
| `title` | `string` | `'No items found'` | Title text |
| `description` | `string` | - | Description text |
| `action` | `{label, onClick}` | - | CTA button |
| `illustration` | `ReactNode` | - | Custom illustration |

### Examples
```jsx
import { SearchIcon, PlusIcon } from 'lucide-react';

// Basic empty state
<EmptyState
  icon={SearchIcon}
  title="No results"
  description="Try adjusting your search"
/>

// With action button
<EmptyState
  icon={FileIcon}
  title="No documents"
  description="Create your first document"
  action={{
    label: 'Create Document',
    onClick: handleCreate,
  }}
/>

// Custom illustration
<EmptyState
  title="Let's get started"
  illustration={<CustomIllustration />}
  action={{
    label: 'Get Started',
    onClick: () => {},
  }}
/>
```

---

## StatCard

Statistics display card.

### Import
```jsx
import { StatCard } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Card label |
| `value` | `string \| number` | Required | Main value |
| `icon` | `ReactComponent` | - | Icon component |
| `change` | `string` | - | Change text |
| `changeType` | `'positive' \| 'negative'` | `'positive'` | Change color |
| `trend` | `string` | - | Trend indicator (↑/↓) |
| `description` | `string` | - | Description text |

### Examples
```jsx
import { Users, TrendingUp } from 'lucide-react';

// Basic stat card
<StatCard
  label="Active Users"
  value="1,234"
  icon={Users}
/>

// With change
<StatCard
  label="Revenue"
  value="$42,500"
  icon={DollarIcon}
  trend="↑ 12%"
  change="vs last month"
  changeType="positive"
/>

// Negative change
<StatCard
  label="Churn Rate"
  value="2.3%"
  trend="↑ 0.5%"
  change="vs last month"
  changeType="negative"
/>
```

---

## Tooltip

Hover tooltip component.

### Import
```jsx
import { Tooltip } from '../components/ui';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | Required | Tooltip text |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip position |
| `delay` | `number` | `0` | Delay in ms |
| `children` | `ReactNode` | Required | Trigger element |

### Examples
```jsx
import { HelpCircle } from 'lucide-react';

// Basic tooltip
<Tooltip content="Click to save">
  <button>Save</button>
</Tooltip>

// With delay
<Tooltip content="More information" delay={200}>
  <HelpCircle size={18} />
</Tooltip>

// Position variants
<Tooltip content="Above" position="top"><button>Top</button></Tooltip>
<Tooltip content="Below" position="bottom"><button>Bottom</button></Tooltip>
<Tooltip content="Left" position="left"><button>Left</button></Tooltip>
<Tooltip content="Right" position="right"><button>Right</button></Tooltip>
```

---

## AppLayout

Main application layout wrapper.

### Import
```jsx
import AppLayout from '../components/layout/AppLayout';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Page content |

### Features
- Auto sidebar on desktop
- Mobile navigation
- Proper spacing/padding
- Sticky header

### Examples
```jsx
import AppLayout from '../components/layout/AppLayout';

export default function Dashboard() {
  return (
    <AppLayout>
      <h1>Dashboard</h1>
      <p>Content with proper spacing</p>
    </AppLayout>
  );
}
```

---

**Last Updated:** April 2026
