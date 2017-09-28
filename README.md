# FlexiTable (react-flexi-table)

FlexiTable is a react table component that dynamically adjusts column widths to fit content and space created by the people at [lendinvest.com](http://lendinvest.com).

Contents:
  - Why create this project?
  - High level explanation
  - Usage
    - Code
    - Guide to styling
  - How does it work
  - Missing Features
  - Known Issues
  - FAQ
  - Alternatives
  - Instalation
  - Developing & Contributing


# Why?!

With most basic tables you have the following options:
  - *Make every column a fixed with*. This isn't reactive, is a pain to maintain, and can leave a lot of space unused (for instance when you have to leave enough space to fit $10,000,00 when 99% of times the amount is < $100)
  - *Make every column a percentage*. This is reactive to a degree but will leave a lot of white space on larger devices, and squash everything on smaller devices. It's difficult to create a consistent apperance.

We wanted something better. We wanted the column widths to react to their content.

# High level summary

To make the table and data best fit the space, this component needs to know how each column works relative to its data. FlexiTable supports three different column types to do this.

  - **Fixed:** The simplest column type. A single fixed width. Good for columns with data that is always the same on every row. e.g. an image, a 'Delete' button, or 'edit' link.
  - **Fit To Content:** This column type changes the width of the column to fit the biggest piece of content within that content. Good for things like status codes, or numbers where you don't want to take up any more space than you need to, but the content should never wrap.
  - **Flexi:** Flexi columns will expand or shrink to fit the available space. These are good for long pieces of text such as comments, addresses, and generally things that you are ok with wrapping over multiple lines. At least one column should be a flexible column. _This is the default_.


## Usage

### Code

Please see `/demo/src/index.js` for example.

#### FlexiTable

You can define a felxitable in jsx as follows.

```javascript
    <FlexiTable
      className="DemoTable"
      columns={tableColumns}
      data={tableData}
      halfGutterWidth={25}
      marginWidth={20}
    />
```

All the props with a * are required.

| Prop | Description |
| ------ | ------ |
| `className` | This is will be displayed on a higher level than the FlexiTable and FlexiTable--outer-box divs  |
| `columns`* | An array of objects, each describing a column, in column order. If this changes the table column sizing will be recalculated. See directly below for more info. |
| `data`* | An array of objects, each item representing a row of data to display. There's no restrictions here, except that your column definitions know how to handle them. If this changes the table column sizing will be recalculated. |
| `halfGutterWidth`* | Size in px of half a gutter. The inside padding for each cell in other words. The distance between two cells will be `halfGutterWidth * 2`. |
| `marginWidth`* | Size in px of the margin to the left and right of the table. |

Note that `halfGutterWidth` and `marginWidth` are just defining horizontal width. Vertical height should be defined with css styles, that will be covered in the *Guide to styling* section. We needed to define the horizontal gutters and margins here so the column calculations correctly know how much free space to allocate.

#### Column Definitions

Here's a simple **Fixed** width style column:

```javascript
    {
      // name is used for the css class
      name: 'Region',
      
      // fixedWidth indicates this is a fixed width type of column and what that width is
      fixedWidth: 120,
      
      // headerComponent is any react component (inline jsx, function, class, etc)
      // we'll use it to display the contents of the header cell
      headerComponent: () => <span>Region</span>,
      
      // cellComponent is any react component (inline jsx, function, class, etc)
      // we'll use it to display the contents for this column on each row
      cellComponent: props => <span>{props.rowData.region}</span>,
    },
```

Here's a **Fit To Content** style column, with some additional fields:

```javascript
    {
      name: 'LastPaymentAmount',
      
      // fitToContentWidth indicates that this is a 'Fit to Content' type of
      // content. It will try to expand to fit the widest piece of content
      fitToContentWidth: true,
      headerComponent: () => <span>Last Payment Amount</span>,
      
      // cellDataSelector can either be a string referencing the data in the
      // current row object, or a function that returns the data to use for 
      // this cell
      cellDataSelector: 'subscription.lastPaymentAmount',
      
      // here we've used a predefined component for the cellComponent
      cellComponent: MyCustomFlexiTableCurrencyComponent,
      
      // fitToContentWidth columns will obey minWidth and maxWidth 
      // restrictions. These are in pixels
      minWidth: 70,
      maxWidth: 250,
    },
```

Here's a **Flexi** style column, with some additional fields:

```javascript
    {
      name: 'Status',
      headerComponent: () => <span>Status</span>,
      cellDataSelector: 'subscription.status',
      
      // we can define a function to derive a css class to be used on the
      // outer-cell for styling.
      cellClassNameSelector: props => props.cellData.x === 'Up to date' ? 'good' : 'bad',
      
      // Note: In this case we haven't defined a cellComponent. It will
      // display the data from cellDataSelector alone within the cell by
      // default.
      
      // Note: We haven't set `fixedWidth` or `fitToContentWidth`. That
      // means this will be Flexi style column, since that's the default
    },
```

All the props with a * are required.

Either `cellDataSelector` or `cellComponent`, or both should be defined.

| Prop | Description |
| ------ | ------ |
| `name`* | This is used for class names and identification.  |
| `headerComponent`* | A react component which will display the header for the column. It will receive props: `{ columnName, columnNumber, column }` |
| `cellDataSelector` | A string referencing the path of the data in the row (used by lodash.get), or a function to generate the cellData props used later. The function will receive arguments `(rowData, rowNumber, columnName, columnNumber, column )`. If this prop is not set, the `cellData` prop for other functions will be set to the rowData |
| `cellComponent` | A react component which will display the contents of the cell for the column. It will receive props: `{ cellData, rowNumber, rowData, columnName, columnNumber, column}`. If this prop is not set a FlexiTableDefaultCellComponent will be used, which just renders the cellData as is. |
| `cellClassNameSelector` | A function that generating a classname to use for a cell. Usefull for status type columns where you might want to set the background or some feature of the cell via css. It will receive the same props as `cellComponent`, `{ cellData, rowNumber, rowData, columnName, columnNumber, column}`  |
| `minWidth` | An integer that sets the minimum width for a column. Has no affect on fixedWidth columns.  |
| `maxWidth` | An integer that sets the maximum width for a column. Has no affect on fixedWidth columns.  |
| `fixedWidth` | An integer that sets the fixed width for a column, and sets the column to fixed mode for column width calculations.  |
| `fitToContentWidth` | A boolean that defines if a column should size itself to fit the maximum content width of any of its cells. Sets the column to `Fit to Content` mode for column width calcuations. minWidth & maxWidth can be used to restrict this. If this is false or not set, and fixedWidth is not set, the the column will go into `Flexi` mode for width calculations. |

Note the `columnNumber` and `rowNumber` are 0-indexed.

For the props/args that are passed to cellDataSelector, cellComponent & cellClassNameSelector:

| Prop | Description |
| ------ | ------ |
| `cellData` | This is the result of the `cellDataSelector`, or the rowData if cellDataSelector is not defined.  |
| `rowNumber` | 0-indexed number of the row (from top to bottom). |
| `rowData` | The current element of the `data` prop passed to FlexiTable for the current row. |
| `columnName` | Name field of the current column definition. |
| `columnNumber` | 0-indexed number of the column (from left to right). |
| `column` | The current column definition.  |

You can add additional props to the column definitions which will be passed through to the column. For example `sortOrder` if you want to display a sort indicator on the column. To prevent any conflicts with future fields that may be added to the column definition, add them to a `custom` field on your column.

### Guide to styling

Please see `/demo/src/demo.scss` for a full example.

Specific Styling Examples:

**Spacing above & below row**

There are currently two primary classes for setting the spacing above and below rows: `FlexiTableSectionVSpace` and `FlexiTableRowVSpace`. 

`FlexiTableSectionVSpace` will appear above the first row of a section and below the last row of a section, where a section is the header or body. Additionally there is `FlexiTableSectionVSpace--edge-top` and `FlexiTableSectionVSpace--edge-bottom` if you want to get more specific. So if you wanted to make the top of the header at 50px and set the rest at 15px you could do the following:

```css
.FlexiTableSectionVSpace {
    height: 15px;
}
.FlexiTable--header .FlexiTableSectionVSpace.FlexiTableSectionVSpace--edge-top {
    height: 50px;
}
```

`FlexiTableRowVSpace` is very similar, except it's applied to the spaces inbetween normal rows. It also has `FlexiTableRowVSpace--edge-top` and `FlexiTableRowVSpace--edge-bottom` if you wanted to set the space above a row seperatly to the space below.

To just set a space of 15px around all types of rows you can do the following:

```css
.FlexiTableSectionVSpace,
.FlexiTableRowVSpace {
    height: 15px;
}
```

**Border around the table**

To set a border around the whole table apply a style to  `.FlexiTable--border-box`. DO NOT set a border style to the `.FlexiTable--outer-box` or `.FlexiTable` the border box switches around depending on whether or not a scroll-bar is being displayed

```css
.FlexiTable--border-box {
    border: 1px solid #d6d6d6;
}
```

**Alternating background colors for rows (zebra-striping)**

Alternating background colors can be done by using subselectors on `FlexiTableBodyRow` as follows:

```css
.FlexiTableBodyRow:nth-child(even) {
    background-color: rgba(234,234,234,0.1);
}

.FlexiTableBodyRow:nth-child(odd) {
  background-color: rgba(234,234,234,0.4);
}
```

Note that header row is `FlexiTableHeaderRow`, different separate from `FlexiTableBodyRow`, and they both share `FlexiTableRow`.

**Aligning column content**

Assuming you have a column with name: 'Region' you could right align it by doing the following:

```css
.FlexiTable--column-Region  .FlexiTableCell {
  text-align: right;
}
```

This aligns both the header and body cells. If you just wanted to align the header or body use `.FlexiTableHeaderCell` or `.FlexiTableBodyCell` respectively, instead of `.FlexiTableCell`

**Heading styles**

The following sets a seperate background color, border and text weight for the headings (This is using sass nesting):

```css
.FlexiTableHeaderRow {
  background-color: rgba(234,234,234,0.1);
  border-bottom: 1px solid #d6d6d6;

  .FlexiTableCell {
    font-weight: 600;
  }
}
```

Note you could have used `.FlexiTableHeaderCell` in this case. It doesn't matter.

**Different font-sizes for body columns**

The following sets a specific font size for the 'Region' column. Only on body cells, not header cells. Using `.FlexiTableCell` instead of `.FlexiTableBodyCell` would set it on both header and body cell.

```
.FlexiTable--column-Region .FlexiTableBodyCell {
  font-size: 17px;
  line-height: 26px;
}

```

**Overflow ellipsis**

If you wish to display ellipsis instead of wrapping text that no longer fits in the column you can do the following. Note this requires that the contents of the text is within a `span`. Using the default `cellComponent` won't have a `span`.

```
.FlexiTable--column-Region  .FlexiTableBodyCell span {
  overflow: hidden;
  text-overflow: ellipsis;
  display: inherit;
  white-space: nowrap;
}
```

### General div/class layout:

* Your `className` is at the top level div.
* Underneath that is `FlexiTable--outer-box`.
* At the next level we have a div with both `FlexiTable` and `FlexiTable-[uuid]` where the uuid is auto generated.
* Under that we split things into `FlexiTable--header` and `FlexiTable--body`
  *  `FlexiTable--header` is broken up into one or more `FlexiTableHeaderRow` (which are also  `FlexiTableRow`)
  * `FlexiTableHeaderRow` has divs for each column with all three `FlexiTableHeaderCell--outer`, `FlexiTable--column-num-[columnNumber]`, `FlexiTable--column-[columnName]` classes
  * `FlexiTableHeaderCell--outer` contains the spacers described below, then a div with both `FlexiTableHeaderCell` and `FlexiTableCell`
  * Then at the next level we have the custom `headerComponent` defined in the column.
* For the ``FlexiTable--body`
 `FlexiTable--body` is broken up into one or more `FlexiTableBodyRow` (which are also  `FlexiTableRow`)
  * `FlexiTableBodyRow` has divs for each column with all three of `FlexiTableBodyCell--outer`, `FlexiTable--column-num-[columnNumber]`, `FlexiTable--column-[columnName]` classes
  * `FlexiTableBodyCell--outer` contains the spacers described below, then a div with both `FlexiTableBodyCell` and `FlexiTableCell`
  * Then at the next level we have the custom `cellComponent` defined in the column.

Between the `FlexiTableRow` and the `FlexiTableCell` for both header and body rows we have the following spacer code that is responsible for the margin/padding around each cell.

* First we have a `FlexiTableSectionVSpace` or `FlexiTableRowVSpace` depending on the row position. This div creates the vertical space **above** each cell.
* In the middle we have `FlexiTableCellSpacer--inner-row` div, which contains:
   * Firstly a `FlexiTableColumnMargin` or `FlexiTableColumnGutter` depending on the column position. This div creates the horizontal space to the **left** of the cell.
   * And in the middle we have `FlexiTableCell` itself.
   * Lastly a `FlexiTableColumnMargin` or `FlexiTableColumnGutter` depending on the column position. This div creates the horizontal space to the **right** of the cell.
* Lastly we have a `FlexiTableSectionVSpace` or `FlexiTableRowVSpace` depending on the row position. This div creates the vertical space **below** each cell.

The spacing example **Spacing above & below row** a few sections above describes how you can use those spacers. 

**Styling Restrictions**

The following styles and attributes are managed by the FlexiTable itself. Changing them could break things. This is mostly related to column width calculations 
* `minWidth`, `maxWidth` and `width` on anything within <FlexiTable>. If you want to constrain with of table by parent DIV.
* `FlexiTable--measure-mode`. This is used to figure out the width of the columns. Messing with this is going to break the calculations.
* The `box-sizing`, `display`, `flex`, `overflow` attributes. Changing any of these will seriously break the table.
* Ignoring that go crazy. And anything within the components you define with `headerComponent` and `cellComponent` are fair game.


## How does it work

Before displaying anything the table does an invisible test render, with every cell able to strech as wide as they can. At that point we measure the widths of each of the cells at their widest point, and feed that information, along with the column types, to a calculator.

If the data or column definitions change, we do the test render again to get the new widths.

If the size of the table changes we just recalculate the space.

FlexTable uses FlexBox to present the table.

A custom uuid is created for each table so if there is multiple FlexiTables on on page, it doesn't get confused about which table it needs to calculate and manipulate styles for.

### What doesn't flexi table do?

* **Row or Cell click event handlers** - This is something we really should add. It should be fairly straight forward. You can of course add click handlers to anything in the components you define for each cell.
* **Sorting, filtering, pagination & loading data** - FlexiTable is only concerned with displaying data. All sorting, filtering, fetching and manipulating of data should be done elsewhere. Having said that it's easy enough to add sorting indicators if that's what you'd like. Please see the information in the styling section.
* **Cells that span multiple columns** - This is something I'd like to add.
* **Cells that span multiple rows** - We have NO plans to do this currently. It's not something we think we'll need.
* **Aggregate rows (GroupBy headers + Footers)** - We would be interested in adding this, but have no immediate plans to.
* **Fixed Table Height with vertical scroll** - We have no current plans to do this, but it would be a good feature to have.

### Known Issues:

* When the FlexiTable does a test render to gather the width of the each cell it will render every cell in the table. If the table has 50,000 rows, it will render all of them. We should limit this by default to say 50 rows, and provide an option to set that number.
* It does not support iOS < 10.0
* FullStory (and probably other simiar session-replay tools) will not display this table correctly. Everything will be squashed to the left. That's because they don't support changing the stylesheet using the insertRule method of CSSStyleSheet.

### Q & A

> Q: What happens if, with **min-widths** and **fixed-widths** set, the table is too wide to fit within the page?

A: The table will become a scrollable div, letting the user scroll horizontally.

> Q:  What happens if, with **max-widths** and **fixed-widths** set, the table is too narrow to fit within the page?

A: The div with class 'FlexiTable' will shrink to fit the space. Note that the div with the *className* you provided, and the div with class 'FlexiTable--outer-box' will still be remain at the full width. Use this to position the table within the extra space.

> Q:  Why does each cell have seperate divs for margins/padding? Couldn't you just using the margin/padding css attributes?

A: Good question. There are a few reasons.
* I wanted to give people the ability to adjust their own padding/margins within cells without breaking the gutters.
* It makes it easier to define spacing via styles. i.e. for the first or last row of the table. This way you can just set the height for say the `.FlexiTable--body .FlexiTableSectionVSpace--edge-top` to increase the distance between the header and first body row.
* It lets you define things in the margins with css.
* In the initial version of this table the gutters could become narrower as the table started hitting the `min-width` limits of its columns. With more advanced column types this wasn't needed so much, but it's something I do consider adding back.

### Alternatives:

None of the following flexibile columns to the same degree (hence why this project exists in the first place), but they have a great deal of additional features which may suit your use case more:

* Facebook's fixed-data-table (https://facebook.github.io/fixed-data-table/)
* React-bootstrap-table (http://allenfang.github.io/react-bootstrap-table/index.html)
* Adazzle's react-data-grid (http://adazzle.github.io/react-data-grid/)

### Dependencies

ReactTable uses a number of open source projects to work properly:

* [React](https://facebook.github.io/react/) - It is a **react**-flex-table after all
* [classnames](https://github.com/JedWatson/classnames) -  A simple JavaScript utility for joining classNames together.
* [decimal.js-light](https://github.com/MikeMcl/decimal.js-light) - Do precisision math calculations
* [react-measure](https://github.com/souporserious/react-measure) - Lets us know when the table is resized
* [lodash](https://github.com/lodash/lodash) - utility functions

The demo has a few more random dependencies.

### Support

Tested against the latest versions of: Chrome, Firefox, Safari & (iOS 10+), Edge and IE 11.

### Installation

Currently, as this project has not been published to npm, installation requires referencing the github project directly. This will all change when we begin to publish in NPM.

Add the following dependancy to your packages:

```
"react-flexi-table": "git+https://[private-key-here]:x-oauth-basic@github.com/lend-invest/react-flexi-table.git#[commit to target here]",
```

Then add the path to your babel loaders:

```javascript
include: [
  paths.appSrc,
  path.resolve(__dirname, '../node_modules/react-flexi-table'),
],
```

Finally after doing a yarn install (or npm install) you can load the project via the full path. 

```
import FlexiTable from 'react-flexi-table/src/index'
```



### Development

Want to contribute? Great!

Flexitables uses [nwb](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb) for fast developing.

Open your favorite Terminal and run this to install nwb.

```sh
$ npm install -g nwb
```

Now you can start the demo, build the library excetera. Type the following to start the demo:

```sh
$ yarn start
```

License
----

MIT


