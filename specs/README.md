## Design Specs

[Design Specs Site](https://samrose3.github.io/spec-viewer)

## Adding a spec

So you want to add a design spec?

### Requirements

1. [Sketch App](https://www.sketchapp.com/) version 49 or greater
2. [Sketch Measure](https://github.com/utom/sketch-measure) plugin
3. or [Marketch](https://github.com/tudou527/marketch) plugin

### 1. Export your work using [Sketch Measure](https://github.com/utom/sketch-measure#spec-export) (or Marketch)

[Sketch Measure instructions](https://github.com/utom/sketch-measure#spec-export)

1. Select an artboard (or multiple artboards) in Sketch
2. Navigate to `Plugins` > `Sketch Measure` > `Spec Export` in the Sketch top menu
3. Alternatively, you can use the shortcut `⌃` + `⇧` + `E`
4. Name your export what you would like it to be named on the Design Specs site (ex: `my_spec_export` would display as `My Spec Export`)
5. Click **Export**

![Make export](../../../raw/master/images/make_export.gif)

### Upload your Spec Export

1. Go to the `specs` folder in the **Zen-Design** repo
2. Click `Upload file`
3. Drag & drop your exported spec folder
4. Add a commit message (ex: _Adding final design spec for User Management_)
5. Commit changes to repo
6. Sit back and relax while the [Design Specs](https://samrose3.github.io/spec-viewer) site is automatically updated 🍹✨

> It usually takes about 2 to 5 minutes for the site to update. Just be patient :)

![Upload spec](../../../raw/master/images/upload_spec.gif)

## Removing a spec

Removing a spec is easy. Simply add a `.gitremove` file to the spec folder you want to delete.

1. Go to the `specs` folder in the **Zen-Design** repo
2. Navigate to the folder you want to remove
3. Click `Create new file`
4. Name the file `.gitremove` (don't forget the `.`)
5. Add a commit message (ex: _Removing the User Profile spec from the Management folder_)
6. Commit changes to repo
7. Sit back and relax while the [Design Specs](https://samrose3.github.io/spec-viewer) site is automatically updated 🍹✨

> Again, it usually takes about 2 to 5 minutes for the site to update. Just be patient :)

![Remove spec](../../../raw/master/images/remove_spec.gif)