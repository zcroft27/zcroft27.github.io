# Photos

Drop your images into the matching folder, then they'll appear on the Travels page.
Each section shows two photos: `1.jpg` and `2.jpg`.

## Folders (in page order)
- `photos/italy/1.jpg`, `2.jpg`
- `photos/switzerland/1.jpg`, `2.jpg`
- `photos/cape-cod/1.jpg`, `2.jpg`
- `photos/pacific-northwest/1.jpg`, `2.jpg`
- `photos/new-york-city/1.jpg`, `2.jpg`
- `photos/puerto-rico/1.jpg`, `2.jpg`
- `photos/south-africa/1.jpg`, `2.jpg`
- `photos/trumpet/1.jpg`, `2.jpg`      (you playing trumpet)
- `photos/climbing/1.jpg`, `2.jpg`     (you rock climbing)

## Notes
- Name your two photos `1.jpg` and `2.jpg` and drop them in — no code editing needed.
- Want more than one photo in a section? Add the extra filename to that
  section's `photos: [...]` list in `travels.html` (e.g. `["1.jpg", "2.jpg"]`).
- Reorder sections by moving lines in the `trips` array in `travels.html`.
- Don't have a photo for a section yet? It shows a tidy placeholder tile,
  or delete that section's line from the `trips` array.
- Add an optional caption with `{ file: "1.jpg", caption: "Old San Juan" }`.
- Resize large photos to ~1600px wide before committing so pages load fast.
