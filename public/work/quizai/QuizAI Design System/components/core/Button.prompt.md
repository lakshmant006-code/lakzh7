Solid, outline, or ghost button for primary/secondary/tertiary actions — use `primary` for one hero action per screen ("Sign In"), `secondary` for its outline pair ("Sign Up", "Back to Options").

```jsx
<Button variant="primary">Sign In</Button>
<Button variant="secondary">Don't have an account? Sign Up</Button>
<Button variant="ghost" icon="fa-solid fa-arrow-right">View Details</Button>
```

Variants: `primary` (maroon fill), `secondary` (maroon outline, white fill), `ghost` (no border, text-only, for inline row actions like "View Details →"). `size="sm"` for compact/inline contexts.
