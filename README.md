# CRYPTSTRING

This repository contains the code for the individual project of BAC3 at UNamur. My task was to develop CRYPTSTING, a client sided web application for the visualisation and manipulation of cryptographic primitives. 

## How to launch the app?

Nothing more simple. Just open the base.html in a web browser (except Internet Explorer!)

## Can I use the app?

The app is available at [https://antoinemouchet.github.io/base](https://antoinemouchet.github.io/base)

## How do I use the app?

### Basic usage

* Enter the string you want to encrypt in the text box labelled "Your string".
* Select a method in the "METHODS" menu.
* Press the + button next to the menu.
* (Enter the key in the key field of the method if needed)
* The encrypted string is displayed at the bottom.

### More features

#### Upper/Lower

You can change your input string to upper or lower case only by pressing the corresponding button next to the input text box.

#### (De)activate a method

You can activate or deactivate a method by pressing the button next to it in the status column.
A deactivated method will not be applied to the string.

#### Delete a method

You can remove a cryptographic primitive from the active set of operation by pressing the trash can button at the end of its line.

#### Export

You can export the current sequence of operations by clicking on the export button at the bottom of the page.

#### Import

You can also import a sequence of operations, you just need to browse your files and select a json file of operations previously exported then press import. 
