# Trilium-Breadcrumbs

A widget to show note breadcrumbs at the bottom of the page.

## Demo

https://github.com/rauenzi/Trilium-Breadcrumbs/assets/6865942/e3578d3d-78d9-4c32-84d6-063023a02f5f


## Features

- Shows breadcrumbs on active note
- Optional history navigation (forward/backward)
- Display as a note detail or at top or bottom
- Enable or disable at will
- Toggleable per note
- Custom styles and settings via promoted attributes

## Installation

The installation is easier than ever. Grab the `.zip` file from the [latest GitHub release](https://github.com/rauenzi/Trilium-Breadcrumbs/releases/latest), and use the Trilium import function to bring it into your app. Be sure to uncheck the "safe import" option.

## Usage

### Breadcrumbs

The breadcrumbs will automatically appear for all notes. You can disable the widget globally by adding the checking the option in promoted attributes. You can also disable it for a single note by adding `#breadcrumbsDisable` to the note.

### History

The forward/backward buttons are enabled by default. You can hide them by selecting the option in promoted attributes.

### Position

The breadcrumb bar appears a part of the note by default. If you'd rather it appear at the top of the page, simply give it the enter `top` in the location promoted attribute. If you'd rather it appear at the bottom of the panel, give it then enter `bottom`.

For this option, the widget will not relocate immediately due to how Trilium operates. You'll have to reload via `F5` or `ctrl`+`r`.

### Breadcrumb Width

Sometimes note titles get out of control so the width of each breadcrumb gets too big. By default the widget cuts it off at 250px, but you are free to adjust this using the promoted attribute shown on the widget.

### Styling

You can remove the borders of the breadcrumbs bar by selecting the hide borders option in promoted attributes. For more advanced styling, you'll have to add your own CSS!


## Links

Check out my other Trilium-based projects:
- [Trilium Markdown Preview](https://github.com/rauenzi/Trilium-MarkdownPreview)
- [Trilium LaTeX Preview](https://github.com/rauenzi/Trilium-LaTeXPreview)
- [Trilium Breadcrumbs](https://github.com/rauenzi/Trilium-Breadcrumbs)
- [Trilium SingleFile](https://github.com/rauenzi/Trilium-SingleFile)
- [Trilium Types](https://github.com/rauenzi/trilium-types)
- [Trilium ETAPI](https://github.com/rauenzi/trilium-etapi)
- [Trilium Pack](https://github.com/rauenzi/trilium-pack)

Want more? Be sure to check out the [Awesome Trilium](https://github.com/Nriver/awesome-trilium) list!