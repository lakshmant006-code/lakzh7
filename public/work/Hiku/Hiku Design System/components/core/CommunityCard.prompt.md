CommunityCard — a club/group card for the Community feed.

```jsx
<CommunityCard image={photo} title="ASU Outdoors Club"
  description="Weekend hikes, gear swaps and trail cleanups around Flagstaff."
  members={412} onJoin={toggle} />
<CommunityCard image={photo} title="Sedona Trail Runners" compact />
```

Banner image, bold title, muted description, Join button + "Know more" link. `compact` drops the body to banner + title (secondary feed rows).
