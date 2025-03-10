import React from "react";
import { View } from "react-native";
import { Svg, Text, G, Rect, Path } from "react-native-svg";
import AbstractChart from "./abstract-chart";

const Pie = require("paths-js/pie");

class ProgressChart extends AbstractChart {
  highColors = [
    "rgba(207, 148, 125, 0.8)",
    "rgba(133, 175, 173, 0.8)",
    "rgba(99, 117, 128, 0.8)"
  ];
  lowColors = [
    "rgba(207, 148, 125, 0.2)",
    "rgba(133, 175, 173, 0.2)",
    "rgba(99, 117, 128, 0.2)"
  ];

  render() {
    const { width, height, style = {}, data, hideLegend } = this.props;
    const { borderRadius = 0, margin = 0, marginRight = 0 } = style;

    if (Array.isArray(data)) {
      data = {
        data
      };
    }

    const pies = data.data.map((pieData, i) => {
      const r = ((height / 2 - 32) / data.data.length) * i + 32;
      return Pie({
        r,
        R: r,
        center: [0, 0],
        data: [pieData, 1 - pieData],
        accessor(x) {
          return x;
        }
      });
    });

    const pieBackgrounds = data.data.map((pieData, i) => {
      const r = ((height / 2 - 32) / data.data.length) * i + 32;
      return Pie({
        r,
        R: r,
        center: [0, 0],
        data: [0.999, 0.001],
        accessor(x) {
          return x;
        }
      });
    });

    const withLabel = i => data.labels && data.labels[i];

    const legend = !hideLegend && (
      <>
        <G>
          {pies.map((_, i) => {
            return (
              <Rect
                key={Math.random()}
                width="16px"
                height="16px"
                fill={this.highColors[i]}
                rx={8}
                ry={8}
                x={this.props.width / 2.5 - 24 +
                  ((this.props.width * 0.8) / data.data.length) * i +
                  12 * 2}
                y={
                  -(this.props.height / 2.5) +
                  ((this.props.height * 0.8) / data.data.length) +
                  12
                }
              />
            );
          })}
        </G>
        <G>
          {pies.map((_, i) => {
            return (
              <Text
                key={Math.random()}
                fill={"#ffffff"}
                // x={this.props.width / 2.5}
                // y={
                //   -(this.props.height / 2.5) +
                //   ((this.props.height * 0.8) / data.data.length) * i +
                //   12 * 2
                // }
                x={this.props.width / 2.5 +
                  ((this.props.width * 0.8) / data.data.length) * i +
                  12 * 2}
                y={
                  -(this.props.height / 2.5) +
                  ((this.props.height * 0.8) / data.data.length) +
                  12 * 2
                }
                {...this.getPropsForLabels()}
              >
                {withLabel(i)
                  ? `${data.labels[i]} ${Math.round(100 * data.data[i])}%`
                  : `${Math.round(100 * data.data[i])}%`}
              </Text>
            );
          })}
        </G>
      </>
    );

    return (
      <View
        style={{
          width,
          height,
          padding: 0,
          ...style
        }}
      >
        <Svg width={width - margin * 2 - marginRight} height={height}>
          {this.renderDefs({
            width: this.props.height,
            height: this.props.height,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G x={this.props.width / 1.75} y={this.props.height / 2}>
            <G>
              {pieBackgrounds.map((pie, i) => {
                return (
                  <Path
                    key={Math.random()}
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={30}
                    stroke={this.lowColors[i]}
                  />
                );
              })}
            </G>
            <G>
              {pies.map((pie, i) => {
                return (
                  <Path
                    key={Math.random()}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={pie.curves[0].sector.path.print()}
                    strokeWidth={30}
                    stroke={this.highColors[i]}
                  />
                );
              })}
            </G>
          </G>
        </Svg>
        <Svg width={width} height={height}>
        <G x={this.props.width / 10 - 120 } y={this.props.height / 8}>
          {legend}
          </G>
          </Svg>
      </View>
    );
  }
}

export default ProgressChart;
