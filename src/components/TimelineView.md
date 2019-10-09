## The TimelineView Component

### The div#timelineViewContainer (root).

It's offsetWidth/clientWidth (no border) is 1300px by default or set by the parent as a prop. It's height is sufficient to contain its children.

### The div#tvTimeline container and the svg#svg container.

Within the timelineViewContainer are three divs with a width of 98% (default clientWidth: 1268):
  - [a dev-only prolog which displays the values of the tl (timeline) properties;]
  - the tvHeader to contain the title and subtitle of the timeline; it can also contain any checkboxes to vary the display (e.g., no-labels);
  - the tvTimeline container (with position: relative for absolute positioning of era labels); The default height of the tvTimeline is 400 (eraTopMargin: 30; eraHeight: 310; timeAxisHeight:50); it can be increased/decreased by modifying the eraHeight value.
  - a footer;

The timeline container's children are:
  - an svg with the shapes for the timeline, and the time axis; the svgWidth is tvTimeline width [.offsetWidth] less two svgSideMargins(25).
  - a series of html divs for era labels, ...

The width of the tvTimeline is 98% of the timelineViewContainer (default: tcv: 1300, tvt: 1274). The svg element has "margins" of 25 on each side so is 50 less than the tvTimeline width (1224).