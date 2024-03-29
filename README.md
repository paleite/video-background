Videos must be encoded with this, otherwise it gets choppy:

```sh
ffmpeg -i public/horizontal_test_scroll.mp4 -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p public/horizontal_test_scroll-re.mp4;
ffmpeg -i public/vertical_test_scroll_2.mp4 -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p public/vertical_test_scroll_2-re.mp4;
ffmpeg -i public/Vertical_test_scroll.mp4 -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p public/Vertical_test_scroll-re.mp4;
ffmpeg -i public/Sequence-02.mp4 -an -vf scale=376:668 -movflags faststart -vcodec libx264 -g 1 -pix_fmt yuv420p public/Sequence-02-re.mp4;
```

For posters:

```sh
ffmpeg -i public/horizontal_test_scroll.mp4 -frames:v 1 -q:v 2 public/horizontal_test_scroll-poster.jpg;
ffmpeg -i public/vertical_test_scroll_2.mp4 -frames:v 1 -q:v 2 public/vertical_test_scroll_2-poster.jpg;
ffmpeg -i public/Vertical_test_scroll.mp4 -frames:v 1 -q:v 2 public/Vertical_test_scroll-poster.jpg;
ffmpeg -i public/Sequence-02.mp4 -frames:v 1 -q:v 2 public/Sequence-02-poster.jpg;
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
