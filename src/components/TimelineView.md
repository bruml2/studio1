## The TimelineView Component

### The div#timelineViewContainer (root).

It's offsetWidth/clientWidth (no border) is 1300px by default or set by the parent as a prop. It's height is sufficient to contain its children.

### The div#tvTimeline container and the svg#svg container.

Within the timelineViewContainer are three divs with a width of 98% (default clientWidth: 1268):
  - [a dev-only prolog which displays the values of the tl (timeline) properties;]
  - the tvHeader to contain the title and subtitle of the timeline; it can also contain any checkboxes to vary the display (e.g., no-labels);
  - the tvTimeline container (with position: relative for absolute positioning of era labels); 
  - a footer;

The offsetWidth of the tvTimeline is 98% of the timelineViewContainer:
 - default offsetWidth: tcv: 1300, tvt: 1274
 - default clientWidth: tcv: 1300 (no borders), tvt: 1268 (3px border)
 
The timeline container's children are:
  - an svg with the shapes for the timeline, and the time axis; the svgWidth is tvTimeline width [.offsetWidth] less two svgSideMargins(25).
  - a series of html divs for era labels, ...

### The svg#svg container.

The svg element has "margins" of 20 on each side so its clientWidth is 40 less than the tvTimeline clientWidth (1228).

The height of the svg determines all the parent container heights. The default height of the svg container is 400 (eraTopMargin: 30; eraHeight: 316; timeAxisHeight:50); it can be increased/decreased by modifying the eraHeight value.

### Changing the size of the timeline.

The height of the timeline can be changed by setting the tl.eraHeight