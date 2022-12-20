# centrilyze-gui

centrilyze-gui is a companion to the centrilyze package for automated annotation of centrioles.

## Installation

First of all you will need to install Node.js for your system. Then opening a command prompt:

```
cd centrilyze-gui
npm install
npm run package
```

This will create a build of centrilyze-gui that you can use. For mac the gui will be located at: 

```
centrilyze-gui/release/build/mac/ElectronReact
```

wheras for windows it will be at:

```
centrilyze-gui/release/build/ElectronReact Setup 4.6.0.exe
```

## Using centrilyze-gui

Once the GUI has been started it can be used by:

1. Creating a sample json using centrilyze's make_sample_json.py
2. Presseing the select "JSON button" and selecting the sample json
3. Pressing the left arrow key for unoriented samples, the bottom one for undefined or slanted ones and the right arrow key for oriented ones
4. Pressing the "save annotations" button will results in the creation of a "annotated_samples.json" file in the same directory as the sample json which can be used with centrilye's train.py

