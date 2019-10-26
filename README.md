# House Watch!
This is a small TS app which will just watch a particular site for apartment listings and send a slack message. This is purely for personal use!

The config file is removed for privacy purposes but if you wanna play around, then you need to make a config file: `src/configs.ts` whose contents are something like this:

```typescript
export default {
    slack_hook: "https://hooks.slack.com/services/1234/example",
    website_url: "https://wahlinfastigheter.se/"
}
```

Use at your own risk :P