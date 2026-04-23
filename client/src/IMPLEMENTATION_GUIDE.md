# NxtConnect Design System - Implementation Guide

Complete guide for refactoring existing pages and building new features with the design system.

## Quick Start

### 1. Update a Page to Use AppLayout

**Before:**
```jsx
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Content */}
</main>
```

**After:**
```jsx
import AppLayout from '../components/layout/AppLayout';

export default function MyPage() {
  return (
    <AppLayout>
      {/* Content - spacing handled automatically */}
    </AppLayout>
  );
}
```

### 2. Update Button Styling

**Before:**
```jsx
<button className="btn-primary">Click me</button>
<button className="btn-secondary">Cancel</button>
```

**After:**
```jsx
import { Button } from '../components/ui';

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" size="md">Cancel</Button>
<Button variant="danger" size="md">Delete</Button>
<Button variant="ghost" size="sm">More Options</Button>
```

### 3. Update Form Inputs

**Before:**
```jsx
<div>
  <label>Email</label>
  <input className="input" placeholder="..." />
</div>
```

**After:**
```jsx
import { Input } from '../components/ui';

<Input
  label="Email"
  placeholder="user@example.com"
  helper="We'll never share your email"
  error={errorMessage}
/>
```

### 4. Update Cards

**Before:**
```jsx
<div className="card py-4 px-6">
  <h3>Title</h3>
  <p>Content</p>
</div>
```

**After:**
```jsx
import { Card } from '../components/ui';

<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Content</p>
  </Card.Body>
  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card>
```

### 5. Update Status Badges

**Before:**
```jsx
<span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs">
  Active
</span>
```

**After:**
```jsx
import { Badge } from '../components/ui';

<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="error" size="sm">Rejected</Badge>
```

### 6. Update User Avatars

**Before:**
```jsx
{user.profilePhoto ? (
  <img src={user.profilePhoto} className="w-10 h-10 rounded-full" />
) : (
  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
    <span className="text-blue-700">{user.name[0]}</span>
  </div>
)}
```

**After:**
```jsx
import { Avatar } from '../components/ui';

<Avatar
  src={user.profilePhoto}
  initials={user.name?.[0]}
  size="md"
  status="online"
/>
```

## Common Patterns

### Pattern: List of Items with Actions

```jsx
import { Card, Button, Avatar, Badge } from '../components/ui';

<Card>
  <div className="divide-y divide-slate-200">
    {items.map((item) => (
      <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
        <div className="flex items-center gap-3">
          <Avatar initials={item.name[0]} size="sm" />
          <div>
            <h4 className="font-medium text-slate-900">{item.name}</h4>
            <p className="text-xs text-slate-500">{item.description}</p>
          </div>
        </div>
        <Badge variant={item.status === 'active' ? 'success' : 'default'}>
          {item.status}
        </Badge>
        <Button variant="ghost" size="sm" onClick={() => handleAction(item.id)}>
          Action
        </Button>
      </div>
    ))}
  </div>
</Card>
```

### Pattern: Header with Filters

```jsx
import { Input, Button } from '../components/ui';
import { Search, Filter } from 'lucide-react';

<div className="mb-6 flex flex-col gap-4">
  <h1 className="text-h1">Page Title</h1>
  
  <div className="bg-white rounded-lg border border-slate-200 p-4 flex gap-3">
    <Input
      placeholder="Search..."
      icon={Search}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Button variant="secondary" size="md" icon={Filter}>
      Filters
    </Button>
  </div>
</div>
```

### Pattern: Grid of Cards

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id}>
      <Card.Body>
        <h3 className="font-semibold text-slate-900">{item.title}</h3>
        <p className="text-sm text-slate-600 mt-2">{item.description}</p>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" size="sm" onClick={() => handleClick(item.id)}>
          Action
        </Button>
      </Card.Footer>
    </Card>
  ))}
</div>
```

### Pattern: Confirmation Modal

```jsx
import { useModal } from '../hooks/useModal';
import { Modal, Button } from '../components/ui';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await api.delete(`/items/${itemId}`);
    toast.success('Deleted successfully');
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete item?"
        description="This action cannot be undone."
        isDangerous={true}
        actions={[
          { label: 'Cancel', variant: 'secondary' },
          { label: 'Delete', variant: 'danger', onClick: handleDelete },
        ]}
      >
        <p>Are you sure you want to delete this item? All associated data will be lost.</p>
      </Modal>
    </>
  );
}
```

### Pattern: Loading State

```jsx
import { Skeleton } from '../components/ui';

{loading ? (
  <div className="space-y-3">
    <Skeleton variant="rect" width="100%" height="100px" />
    <Skeleton variant="rect" width="100%" height="100px" />
    <Skeleton variant="rect" width="100%" height="100px" />
  </div>
) : items.length === 0 ? (
  <EmptyState
    icon={SearchIcon}
    title="No items found"
    description="Try adjusting your search"
  />
) : (
  <div>{/* Items */}</div>
)}
```

### Pattern: Form with Validation

```jsx
import { Input, Button } from '../components/ui';

function MyForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/submit', formData);
      toast.success('Submitted!');
    } catch (error) {
      setErrors(error.response.data.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email || ''}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
      />
      <Button
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}
```

## Color Usage Guide

### Use Primary Colors For:
- Main call-to-action buttons
- Active navigation states
- Links
- Primary alerts/notifications

```jsx
<Button variant="primary">Submit</Button>
<Badge variant="primary">Featured</Badge>
<div className="text-primary-600">Link text</div>
```

### Use Success Colors For:
- Positive confirmations
- Completed states
- Active status badges

```jsx
<Badge variant="success">Completed</Badge>
<span className="text-success-600">✓ Approved</span>
```

### Use Warning Colors For:
- Cautions
- Pending states
- Needs attention

```jsx
<Badge variant="warning">Pending Review</Badge>
<span className="text-warning-600">⚠ Requires action</span>
```

### Use Error Colors For:
- Deletions
- Failed states
- Errors
- Rejections

```jsx
<Button variant="danger">Delete</Button>
<Badge variant="error">Rejected</Badge>
```

### Use Slate/Gray For:
- Disabled states
- Secondary information
- Helper text
- Dividers

```jsx
<p className="text-slate-600">Secondary information</p>
<Button variant="secondary">Secondary action</Button>
```

## Typography Usage Guide

### Headings
```jsx
<h1 className="text-h1">Page Title - 32px</h1>
<h2 className="text-h2">Section Title - 28px</h2>
<h3 className="text-h3">Subsection - 24px</h3>
<h4 className="text-h4">Card Title - 20px</h4>
<h5 className="text-h5">Label - 18px</h5>
<h6 className="text-h6">Small Label - 16px</h6>
```

### Body Text
```jsx
<p className="text-body">Main content - 14px</p>
<p className="text-body-sm">Secondary content - 13px</p>
<label className="text-label">Form label - 13px font-medium</label>
<p className="text-meta">Metadata - 12px uppercase</p>
<p className="text-muted">Disabled/hint text - gray</p>
```

## Spacing Guide

### Container/Page Spacing
```jsx
<AppLayout>
  {/* Automatically has container-wide padding + py-8 */}
  {/* = max-w-7xl, px-4 sm:px-6 lg:px-8, py-8 */}
</AppLayout>
```

### Internal Component Spacing
```jsx
<Card>
  <Card.Header>  {/* px-4 py-3.5 */}
  <Card.Body>    {/* px-4 py-4 */}
  <Card.Footer>  {/* px-4 py-3.5 */}
</Card>
```

### Margin Between Sections
```jsx
<div className="mb-8">First section</div>
<div className="mb-6">Second section</div>
<div className="mb-4">Third section</div>
```

### Gap Between Items
```jsx
<div className="space-y-3">Single column list</div>
<div className="flex gap-4">Horizontal items</div>
<div className="grid gap-6">Grid items</div>
```

## Accessibility Checklist

When using components, ensure:

- [ ] All buttons/links have `aria-label` if no visible text
- [ ] Form inputs have associated `<label>`
- [ ] Color is not the only indicator (use text + icon)
- [ ] Focus ring visible (tab through page)
- [ ] Text contrast >= 4.5:1 (check with WebAIM)
- [ ] Images have descriptive `alt` text
- [ ] Modal traps focus
- [ ] Error messages linked to inputs

```jsx
// Good: Label associated with input
<Input label="Email" required />

// Good: Icon + text for color-dependent info
<Badge variant="success">✓ Active</Badge>

// Good: Aria label for icon-only button
<button aria-label="Close menu">
  <X size={20} />
</button>

// Good: Descriptive alt text
<img src="..." alt="Mentor Jane Smith with 5-star rating" />
```

## Performance Tips

1. **Memoize card lists**
```jsx
const MentorCard = memo(({ mentor }) => {...});
```

2. **Use Skeleton for lazy loading**
```jsx
{loading ? <Skeleton /> : <Card>{content}</Card>}
```

3. **Debounce search inputs**
```jsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
```

4. **Virtual scroll for long lists** (use react-window)
```jsx
// For lists with 100+ items
<FixedSizeList>{items}</FixedSizeList>
```

## Troubleshooting

### Button not styling correctly
- Check: variant and size props exist
- Check: className overrides not conflicting
- Check: Tailwind CSS configured in parent

### Input focus ring not showing
- Check: Parent or input has `outline-none` removed
- Check: Ring color classes not hidden by overflow

### Modal not displaying
- Check: isOpen state is true
- Check: No parent with `overflow-hidden` on z-context

### Colors looking off
- Check: Using color from new palette (primary, success, etc)
- Check: Not using old colors (blue-700, green-500)
- Check: Dark mode not enabled in settings

---

For more questions, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
