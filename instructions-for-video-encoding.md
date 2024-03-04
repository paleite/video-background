Use these instructions, otherwise the video gets choppy:

```sh
# ffmpeg -i input.mp4 -vf scale=375:667 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output.mp4
ffmpeg -i input.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p output.mp4
```

```sh
ffmpeg -i public/horizontal_test_scroll.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p public/horizontal_test_scroll-re.mp4
ffmpeg -i public/vertical_test_scroll_2.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p public/vertical_test_scroll_2-re.mp4
ffmpeg -i public/Vertical_test_scroll.mp4 -vf scale=376:668 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt yuv420p public/Vertical_test_scroll-re.mp4
```
