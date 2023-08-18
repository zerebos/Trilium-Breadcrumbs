# Trilium-Breadcrumbs

A widget to show note breadcrumbs at the bottom of the page.

## Demo

https://github.com/rauenzi/Trilium-Breadcrumbs/assets/6865942/e3578d3d-78d9-4c32-84d6-063023a02f5f


## Features

- Shows breadcrumbs on active note
- Optional history navigation (forward/backward)
- Display at top or bottom
- Enable or disable at will
- Toggleable per note

## Installation

1. Create a new code note with `JS Frontend` type. Copy and paste [widget.js](https://github.com/rauenzi/Trilium-Breadcrumbs/blob/main/src/widget.js) into the note.
    - Be sure to add the `#widget` attribute to the note
1. (optional) Add your own css between the markers.

## Usage

### Breadcrumbs

The breadcrumbs will automatically appear for all notes. You can disable the widget by adding the `#disable` attribute to it. You can also disable it for a single note by adding `#breadcrumbsDisable` to the note.

### History

The forward/backward buttons are enabled by default. You can disable them by adding the `#disableHistory` label to the widget.

### Position

The breadcrumb bar appears up top by default. If you'd rather it appear at the bottom, simply give it the `#bottom` label.

### Styling

You can remove the borders of the breadcrumbs bar by adding the `#borderless` label to the widget. For more advanced styling, you'll have to add your own CSS!


## Links

Check out my other Trilium addons:
- [Markdown Preview](https://github.com/rauenzi/Trilium-MarkdownPreview)

Want more? Be sure to check out the [Awesome Trilium](https://github.com/Nriver/awesome-trilium) list!