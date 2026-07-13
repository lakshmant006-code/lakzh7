BottomNav — the app's persistent 5-tab bottom bar.

```jsx
<BottomNav active="trails" onChange={setTab} avatarSrc={me.photo} />
```

Defaults to Explore · Trails · Community · Shop · Account. Active tab turns deep green (icon + label). The Account tab renders an avatar circle instead of a line icon. Pass a custom `items` array to relabel.
