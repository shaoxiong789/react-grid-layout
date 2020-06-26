import React from "react";
import _ from "lodash";
import GridLayout, { WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(GridLayout);

export default class MyDragDemo extends React.Component {
  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    // cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  };

  state = {
    layouts: generateLayout()
  }

  generateDOM() {
    return _.map(this.state.layouts, function(l, i) {
      return (
        <div key={i} data-grid={{
          i: l.i, 
          x: l.x, 
          y: l.y, 
          w: l.w, 
          h: l.h,
          new: l.new
        }} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      )
    })
  }

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onDrop = elemParams => {
    alert(`Element parameters:\n${JSON.stringify(elemParams, ['x', 'y', 'w', 'h'], 2)}`);
    const key = Date.now().toString(36);
    console.log(this.state.layouts)
    this.state.layouts.push({
      i: key,
      x: elemParams.x, 
      y: elemParams.y, 
      w: elemParams.w, 
      h: elemParams.h,
      new: true
    })
    this.setState({
      layouts: this.state.layouts
    })
  };

  render() {
    return (
      <div>
        <div
          className="droppable-element"
          draggable={true}
          unselectable="on"
          // this is a hack for firefox
          // Firefox requires some kind of initialization
          // which we can do by adding this attribute
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
          onDragStart={e => {
            e.dataTransfer.setData("text/plain", "")
          }}
        >
          Droppable Element (Drag me!)
        </div>
        <ResponsiveReactGridLayout
          layout={this.state.layouts}
          onLayoutChange={this.onLayoutChange}
          onDrop={this.onDrop}
          isDroppable={true}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    )
  }
}

function generateLayout() {
  return _.map(_.range(0, 3), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: 1,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(MyDragDemo));
}
