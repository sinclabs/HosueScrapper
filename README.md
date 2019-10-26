# House Watch!
This is a small TS app which will just watch a particular site for apartment listings and send a slack message. This is purely for personal use!

The configs file is removed for privacy purposes but is you wanna play around you need to make a configs file: `src/configs.ts` whose contents is something like this:

```typescript
export default {
    slack_hook: "https://hooks.slack.com/services/1234/example",
    website_url: "https://wahlinfastigheter.se/"
}
```

Use at your own risk :P